import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesRepository } from '../infrastructure/repository/likes.repository';
import { HandleLikeCommentDTO } from './dto/likes.dto';
import { CommentsRepository } from '../../comments/infrastructure/repository/comments.repository';

@Injectable()
export class LikesService {
  constructor(
    protected likesRepository: LikesRepository,
    protected commentsRepository: CommentsRepository,
  ) {}

  async handleCommentLikeStatus(likeCommentDto: HandleLikeCommentDTO) {
    const { commentId, commentLikeStatus } = likeCommentDto;
    const commentEntity = await this.commentsRepository.findCommentById(
      commentId,
    );

    if (!commentEntity) {
      throw new NotFoundException({ message: 'Comment not found' });
    }
    const likeEntity = await this.likesRepository.findLikeByCommentId(
      commentId,
      commentEntity.userId,
    );
    //current like status, before update
    const likeStatus = likeEntity.getLikeStatus();

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

    likeEntity.setLikeStatus(commentLikeStatus);
    return this.likesRepository.save(likeEntity);
  }
}

//userId
//status
//date
//patternId
//separate collections for posts and comments

//counts different collections
