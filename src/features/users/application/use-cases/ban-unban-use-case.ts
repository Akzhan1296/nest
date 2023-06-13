import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/repository/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetBanDataDTO } from '../dto/users.dto';
import { PostLikesRepository } from '../../../likes/infrastructure/repository/post.likes.repository';
import { PostsRepository } from '../../../posts/infrastructure/repository/posts.repository';

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
  ) {}

  async execute(command: BanUserCommand) {
    let postsLikeEntityByIds = [];
    // let currentUserId = null;

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

    // currentUserId = user._id.toString();

    // posts likes logic
    // get post entity
    const postsEntity = await this.postsRepository.getPosts();

    // const filteredByUserId = postsEntity.filter((post) => {
    //   const users = post.getWhoLiked();
    //   return users.filter((user) => user.userId === currentUserId);
    // });
    // console.log(filteredByUserId);

    //get likeEntity by postId and userId
    console.log('postsEntity', postsEntity);
    if (postsEntity.length) {
      const promises = postsEntity.map(async (post) => {
        if (command.banData.userId) {
          post.removeNewestUser(command.banData.userId.toString());
          await post.save();
        }
        if (!command.banData.isBanned) {
          const likedUsers = post
            .getWhoLiked()
            .filter((user) => user.userId === post.userId.toString());
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

        console.log('postLike', postLike);

        return postLike;
      });
      console.log('promises', promises);
      postsLikeEntityByIds = (await Promise.all(promises)).filter(
        (item) => item !== null,
      );
    }

    console.log('postsLikeEntityByIds', postsLikeEntityByIds);

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
    return user;
  }
}
