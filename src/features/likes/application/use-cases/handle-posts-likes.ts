import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HandlePostLikeCommentDTO } from '../dto/likes.dto';
import { ObjectId } from 'mongodb';
import { PostsRepository } from '../../../posts/infrastructure/repository/posts.repository';
import { PostLikesRepository } from '../../infrastructure/repository/post.likes.repository';
import { PostLike, PostLikeDocument } from '../../domain/posts.likes.schema';

export class HandlePostsLikesCommand {
  constructor(public postLikeCommentDto: HandlePostLikeCommentDTO) {}
}

@CommandHandler(HandlePostsLikesCommand)
export class HandlePostsLikesUseCase
  implements ICommandHandler<HandlePostsLikesCommand>
{
  constructor(
    @InjectModel(PostLike.name)
    private PostLikeModel: Model<PostLikeDocument>,
    protected postLikesRepository: PostLikesRepository,
    protected postsRepository: PostsRepository,
  ) {}
  async execute(command: HandlePostsLikesCommand) {
    const { postId, postLikeStatus, userId, login } =
      command.postLikeCommentDto;
    const postsEntity = await this.postsRepository.getPostById(postId);
    if (!postsEntity) {
      throw new NotFoundException({ message: 'Post not found' });
    }
    const postLikeEntity =
      await this.postLikesRepository.findLikeByUserAndPostId(
        postId,
        new ObjectId(userId),
      );
    //current like status, before update
    let likeStatus = 'None';
    if (postLikeEntity) {
      likeStatus = postLikeEntity.getLikeStatus();
      postLikeEntity.setLikeStatus(postLikeStatus);
      await this.postLikesRepository.save(postLikeEntity);
    } else {
      //new like entity
      const newPostLikeEntity = new this.PostLikeModel();
      newPostLikeEntity.setLikeStatus(postLikeStatus);
      newPostLikeEntity.setPostId(postsEntity._id);
      newPostLikeEntity.setUserId(new ObjectId(userId));
      postsEntity.setLikedUsers(userId);
      if (postLikeStatus === 'Like') {
        postsEntity.setNewestUser({ userId, login, addedAt: new Date() });
      }
      postsEntity.save();
      await this.postLikesRepository.save(newPostLikeEntity);
    }
    if (postLikeStatus === likeStatus) {
      return;
    }
    // posts repo
    if (postLikeStatus === 'Like') {
      console.log('000');
      this.postsRepository.incLike(postId);
      const users = new Set(postsEntity.getLikedUsers());
      if (!users.has(userId)) {
        postsEntity.setNewestUser({
          userId,
          login,
          addedAt: new Date(),
        });
        postsEntity.save();
      }
      if (likeStatus === 'Dislike') {
        this.postsRepository.decDislike(postId);
      }
    }
    if (postLikeStatus === 'Dislike') {
      this.postsRepository.incDislike(postId);
      if (likeStatus === 'Like') {
        this.postsRepository.decLike(postId);
      }
    }
    if (postLikeStatus === 'None') {
      if (likeStatus === 'Like') {
        this.postsRepository.decLike(postId);
      }
      if (likeStatus === 'Dislike') {
        this.postsRepository.decDislike(postId);
      }
    }
  }
}
