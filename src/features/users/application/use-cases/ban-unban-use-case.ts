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
    private readonly usersRepository: UsersRepository,
    private readonly postLikesRepository: PostLikesRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: BanUserCommand) {
    const user = await this.usersRepository.findUserById(
      command.banData.userId,
    );
    if (!user) throw new NotFoundException('user not found');
    user.setBanData({
      isBanned: command.banData.isBanned,
      banDate: command.banData.isBanned ? new Date() : null,
      banReason: command.banData.isBanned ? command.banData.banReason : null,
    });

    // get all postsEntity
    const postsLikeEntity =
      await this.postLikesRepository.findPostLikesByUserId(user._id);

    // get post entity
    const postEntity = await this.postsRepository.getPostByUserId(user._id);

    //get likeEntity by postId and userId
    const postEntityByIds =
      await this.postLikesRepository.findLikeByUserAndPostId(
        postEntity._id.toString(),
        user._id,
      );

    if (command.banData.isBanned) {
      if (postEntityByIds.getLikeStatus() === 'Like') {
        this.postsRepository.decLike(postEntity._id.toString());
      }

      if (postEntityByIds.getLikeStatus() === 'Dislike') {
        this.postsRepository.decDislike(postEntity._id.toString());
      }
    }

    if (!command.banData.isBanned) {
      if (postEntityByIds.getLikeStatus() === 'Like') {
        this.postsRepository.incLike(postEntity._id.toString());
      }

      if (postEntityByIds.getLikeStatus() === 'Dislike') {
        this.postsRepository.incDislike(postEntity._id.toString());
      }
    }

    // set banned statuses for all posts
    if (postsLikeEntity) {
      const promises = postsLikeEntity.map((post) => {
        post.setUserBanStatus(command.banData.isBanned);
        return this.postLikesRepository.save(post);
      });
      await Promise.all(promises);
    }

    await this.usersRepository.save(user);
    return user;
  }
}
