import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/infrastructure/repository/likes.query.repository';
import { CommentsQueryRepository } from '../infrastructure/repository/comments.query.repository';
import { ObjectId } from 'mongodb';
import { LikeModelView } from '../../likes/infrastructure/models/view.models';
import { PostsQueryType } from '../../posts/api/models/input.models';
import { UsersQueryRepository } from '../../users/infrastructure/repository/users.query.repository';

@Injectable()
export class CommentsQueryService {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  async getCommentById(commentId: string, userId: string) {
    let _userId = null;
    let likeEntity: LikeModelView | null = null;

    try {
      _userId = new ObjectId(userId);
    } catch (err) {
      console.warn('could not transfer id');
    }

    if (_userId) {
      likeEntity = await this.likesQueryRepository.getLikeById(
        commentId,
        _userId,
      );
    }
    const userEntity = await this.usersQueryRepository.findUserById(_userId);
    if (userEntity.banInfo.isBanned) throw new NotFoundException();
    const commentEntity = await this.commentsQueryRepository.getCommentById(
      commentId,
    );
    if (!commentEntity) throw new NotFoundException('comment not found');

    return {
      ...commentEntity,
      likesInfo: {
        ...commentEntity.likesInfo,
        myStatus: likeEntity ? likeEntity.myStatus : 'None',
      },
    };
  }

  async getCommentAll(
    pageSize: PostsQueryType,
    postId: string,
    userId: string,
  ) {
    let _userId = null;

    try {
      _userId = new ObjectId(userId);
    } catch (err) {
      console.warn('can not change user id ');
    }

    const comments = await this.commentsQueryRepository.getCommentsByPostId(
      pageSize,
      postId,
    );

    const likes = await this.likesQueryRepository.getLikesByPostId(
      postId,
      _userId,
    );
    if (!likes.length) {
      return {
        ...comments,
        items: comments.items.map((c) => ({
          ...c,
          likesInfo: { ...c.likesInfo, myStatus: 'None' },
        })),
      };
    }

    return {
      ...comments,
      items: comments.items.map((c) => {
        let myStatus = 'None';
        const foundLike = likes.find(
          (l) => l.getCommentId().toString() === c.id,
        );
        if (foundLike) myStatus = foundLike.getLikeStatus();

        return {
          ...c,
          likesInfo: {
            ...c.likesInfo,
            myStatus,
          },
        };
      }),
    };
  }
}
