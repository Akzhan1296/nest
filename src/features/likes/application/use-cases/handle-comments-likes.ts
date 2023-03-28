import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsRepository } from '../../../comments/infrastructure/repository/comments.repository';
import { Like, LikeDocument } from '../../domain/likes.schema';
import { LikesRepository } from '../../infrastructure/repository/likes.repository';
import { HandleLikeCommentDTO } from '../dto/likes.dto';
import { ObjectId } from 'mongodb';

export class HandleCommentsLikesCommand {
  public likeCommentDto: HandleLikeCommentDTO;
  constructor(likeCommentDto: HandleLikeCommentDTO) {
    this.likeCommentDto = likeCommentDto;
  }
}

@CommandHandler(HandleCommentsLikesCommand)
export class HandleCommentsLikesUseCase
  implements ICommandHandler<HandleCommentsLikesCommand>
{
  constructor(
    @InjectModel(Like.name)
    private LikeModel: Model<LikeDocument>,
    protected likesRepository: LikesRepository,
    protected commentsRepository: CommentsRepository,
  ) {}
  async execute(command: HandleCommentsLikesCommand) {
    const { commentId, commentLikeStatus } = command.likeCommentDto;
    const commentEntity = await this.commentsRepository.findCommentById(
      commentId,
    );

    if (!commentEntity) {
      throw new NotFoundException({ message: 'Comment not found' });
    }
    const likeEntity = await this.likesRepository.findLikeByCommentId(
      commentId,
      command.likeCommentDto.userId,
    );
    //current like status, before update
    let likeStatus = 'None';
    if (likeEntity) {
      likeStatus = likeEntity.getLikeStatus();
      likeEntity.setLikeStatus(commentLikeStatus);
      await this.likesRepository.save(likeEntity);
    } else {
      //new like entity
      const newCommentLikeEntity = new this.LikeModel();
      newCommentLikeEntity.setLikeStatus(commentLikeStatus);
      newCommentLikeEntity.setCommentId(commentEntity._id);
      newCommentLikeEntity.setLikeType('comment');
      newCommentLikeEntity.setUserId(
        new ObjectId(command.likeCommentDto.userId),
      );
      newCommentLikeEntity.setPostId(commentEntity.getPostId());
      await this.likesRepository.save(newCommentLikeEntity);
    }

    if (commentLikeStatus === likeStatus) {
      return;
    }

    if (commentLikeStatus === 'Like') {
      this.commentsRepository.incLike(commentId);
      if (likeStatus === 'Dislike') {
        this.commentsRepository.decDislike(commentId);
      }
    }
    if (commentLikeStatus === 'Dislike') {
      this.commentsRepository.incDislike(commentId);
      if (likeStatus === 'Like') {
        this.commentsRepository.decLike(commentId);
      }
    }
    if (commentLikeStatus === 'None') {
      if (likeStatus === 'Like') {
        this.commentsRepository.decLike(commentId);
      }
      if (likeStatus === 'Dislike') {
        this.commentsRepository.decDislike(commentId);
      }
    }
  }
}
