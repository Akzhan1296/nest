import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/infrastructure/repository/likes.query.repository';
import { CommentsQueryRepository } from '../infrastructure/repository/comments.query.repository';
import { ObjectId } from 'mongodb';
import { LikeModelView } from '../../likes/infrastructure/models/view.models';

@Injectable()
export class CommentsQueryService {
  constructor(
    protected commentsQueryRepository: CommentsQueryRepository,
    protected likesQueryRepository: LikesQueryRepository,
  ) {}
  async getCommentById(commentId: string, userId: string) {
    let _userId = null;
    let likeEntity: LikeModelView | null = null;

    try {
      _userId = new ObjectId(userId);
    } catch (err) {
      console.warn('');
    }

    if (_userId) {
      likeEntity = await this.likesQueryRepository.getLikeById(
        commentId,
        _userId,
      );
    }
    const commentEntity = await this.commentsQueryRepository.getCommentById(
      commentId,
    );
    if (!commentEntity) throw new NotFoundException('comment not found');

    console.log(likeEntity);

    return {
      ...commentEntity,
      likesInfo: {
        ...commentEntity.likesInfo,
        myStatus: likeEntity ? likeEntity.myStatus : 'None',
      },
    };
  }

  async getCommentAll(commentId: string, userId: ObjectId) {
    // arr status
    // const likeEntity = await this.likesQueryRepository.getLikeById(
    //   commentId,
    //   userId,
    // );
    // arr comments
    // const comments = await this.commentsQueryRepository.getComments({
    //   pageNumber: 1,
    //   pageSize: 1,
    // });
    //lookup
    // return {
    //   ...commentEntity,
    //   likesInfo: {
    //     ...commentEntity.likesInfo,
    //     ...likeEntity,
    //   },
    // };
  }
}
