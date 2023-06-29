import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/repository/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetBanDataDTO } from '../dto/users.dto';
import { PostLikesRepository } from '../../../likes/infrastructure/repository/post.likes.repository';
import { PostsRepository } from '../../../posts/infrastructure/repository/posts.repository';
import { LikesRepository } from '../../../likes/infrastructure/repository/likes.repository';
import { CommentsRepository } from '../../../comments/infrastructure/repository/comments.repository';

export class BanUserCommand {
  constructor(
    public banData: Omit<SetBanDataDTO, 'banDate'> & { userId: string },
  ) {}
}
@CommandHandler(BanUserCommand)
export class BanUserCommandUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private postLikesRepository: PostLikesRepository,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: BanUserCommand) {
    let postsLikeEntityByIds = [];
    const user = await this.usersRepository.findUserById(
      command.banData.userId,
    );
    // users data
    if (!user) throw new NotFoundException('user not found');
    user.setBanData({
      isBanned: command.banData.isBanned,
      banDate: command.banData.isBanned ? new Date() : null,
      banReason: command.banData.isBanned ? command.banData.banReason : null,
    });
    await this.usersRepository.save(user);

    const postsEntity = await this.postsRepository.getPosts();
    //get likeEntity by postId and userId
    if (postsEntity.length) {
      const promises = postsEntity.map(async (post) => {
        if (command.banData.userId) {
          post.removeNewestUser(command.banData.userId.toString());
          await post.save();
        }
        if (!command.banData.isBanned) {
          const likedUsers = post
            .getWhoLiked()
            .filter(
              (user) => user.userId === command.banData.userId.toString(),
            );
          if (likedUsers.length) {
            post.setNewestUser(likedUsers[0]);
            await post.save();
          }
        }
        const postLike =
          await this.postLikesRepository.findLikesByUserAndPostId(
            post._id.toString(),
            user._id,
          );
        return postLike;
      });
      postsLikeEntityByIds = (await Promise.all(promises)).filter(
        (item) => item !== null,
      );
    }

    if (postsLikeEntityByIds && postsLikeEntityByIds.length) {
      postsLikeEntityByIds.forEach(async (postEntity) => {
        if (command.banData.isBanned) {
          if (postEntity.getLikeStatus() === 'Like') {
            await this.postsRepository.decLike(postEntity.postId.toString());
          }
          if (postEntity.getLikeStatus() === 'Dislike') {
            await this.postsRepository.decDislike(postEntity.postId.toString());
          }
        }
        if (!command.banData.isBanned) {
          if (postEntity.getLikeStatus() === 'Like') {
            await this.postsRepository.incLike(postEntity.postId.toString());
          }
          if (postEntity.getLikeStatus() === 'Dislike') {
            await this.postsRepository.incDislike(postEntity.postId.toString());
          }
        }
      });
    }

    // get all posts likes Entity
    const postsLikeEntity =
      await this.postLikesRepository.findPostLikesByUserId(user._id);

    // set banned statuses for all posts
    if (postsLikeEntity) {
      const promises = postsLikeEntity.map((post) => {
        post.setUserBanStatus(command.banData.isBanned);
        return this.postLikesRepository.save(post);
      });
      await Promise.all(promises);
    }

    // comments likes logic
    const commentsEntityByUserId = await this.likesRepository.findLikeByUserId(
      user._id,
    );
    if (commentsEntityByUserId) {
      const promises = commentsEntityByUserId.map(async (commentLike) => {
        commentLike.setUserBanStatus(command.banData.isBanned);
        if (command.banData.isBanned) {
          if (commentLike.getLikeStatus() === 'Like') {
            await this.commentsRepository.decLike(
              commentLike.getCommentId().toString(),
            );
          }
          if (commentLike.getLikeStatus() === 'Dislike') {
            await this.commentsRepository.decDislike(
              commentLike.getCommentId().toString(),
            );
          }
        }
        if (!command.banData.isBanned) {
          if (commentLike.getLikeStatus() === 'Like') {
            await this.commentsRepository.incLike(
              commentLike.getCommentId().toString(),
            );
          }
          if (commentLike.getLikeStatus() === 'Dislike') {
            await this.commentsRepository.incDislike(
              commentLike.getCommentId().toString(),
            );
          }
        }
        return this.likesRepository.save(commentLike);
      });
      await Promise.all(promises);
    }
    return user;
  }
}
