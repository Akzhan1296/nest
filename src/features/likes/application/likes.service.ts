import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesRepository } from '../infrastructure/repository/likes.repository';
import { HandleLikeCommentDTO } from './dto/likes.dto';
import { CommentsRepository } from '../../comments/infrastructure/repository/comments.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from '../domain/likes.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: Model<LikeDocument>,
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
      likeCommentDto.userId,
    );
    //current like status, before update
    let likeStatus = 'None';
    console.log(likeEntity);
    if (likeEntity) {
      likeStatus = likeEntity.getLikeStatus();
      likeEntity.setLikeStatus(commentLikeStatus);
      await this.likesRepository.save(likeEntity);
    } else {
      //new like entity
      const newCommentLikeEntity = new this.LikeModel();
      newCommentLikeEntity.setLikeStatus(commentLikeStatus);
      newCommentLikeEntity.setCommentId(commentEntity._id);
      newCommentLikeEntity.setUserId(new ObjectId(likeCommentDto.userId));
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

//userId
//status
//date
//patternId
//separate collections for posts and comments

//counts different collections
