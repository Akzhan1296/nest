import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/infrastructure/repository/likes.query.repository';
import { CommentsQueryRepository } from '../infrastructure/repository/comments.query.repository';
import { PostsQueryType } from '../../posts/api/models/input.models';
import { Utils } from '../../../common/utils';

@Injectable()
export class CommentsQueryService {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}
  async getCommentById(commentId: string, userId: string) {
    const likeEntity = await this.likesQueryRepository.getLikeById(
      await Utils.transformObjectId(commentId),
      await Utils.transformObjectId(userId),
    );
    const commentEntity = await this.commentsQueryRepository.getCommentById(
      await Utils.transformObjectId(userId),
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
    const comments = await this.commentsQueryRepository.getCommentsByPostId(
      pageSize,
      postId,
    );

    const likes = await this.likesQueryRepository.getLikesByPostId(
      await Utils.transformObjectId(postId),
      await Utils.transformObjectId(userId),
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
