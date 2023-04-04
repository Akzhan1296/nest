import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PageSizeQueryModel } from '../../../common/common-types';
import { PostLikesRepository } from '../../likes/infrastructure/repository/post.likes.repository';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';
@Injectable()
export class PostsQueryService {
  constructor(
    protected postQuerysRepository: PostsQueryRepository,
    protected postLikesQueryRepository: PostLikesRepository,
  ) {}
  async getPostWithLikeById(postId: string, userId: string) {
    let _userId = null;
    let postLikeEntity = null;
    try {
      _userId = new ObjectId(userId);
    } catch (err) {
      console.log('could not parse id');
    }
    const post = await this.postQuerysRepository.getPostById(postId);

    if (_userId) {
      postLikeEntity =
        await this.postLikesQueryRepository.findLikeByUserAndPostId(
          postId,
          _userId,
        );
    }

    const a = {
      ...post,
      extendedLikesinfo: {
        ...post.extendedLikesinfo,
        myStatus: postLikeEntity ? postLikeEntity.getLikeStatus() : 'None',
      },
    };
    return a;
  }

  async getAllPostsWithLike(pageParams: PageSizeQueryModel, userId: string) {
    let _userId = null;

    try {
      _userId = new ObjectId(userId);
    } catch (err) {
      console.warn('can not change user id ');
    }
    const posts = await this.postQuerysRepository.getPosts(pageParams);
    const likes = await this.postLikesQueryRepository.findPostLikesByUserId(
      _userId,
    );

    if (!likes.length) {
      return {
        ...posts,
        items: posts.items.map((post) => ({
          ...post,
          extendedLikesInfo: { ...post.extendedLikesinfo, myStatus: 'None' },
        })),
      };
    }

    return {
      ...posts,
      items: posts.items.map((post) => {
        let myStatus = 'None';
        const foundLike = likes.find(
          (l) => l.getPostId().toString() === post.id,
        );
        if (foundLike) myStatus = foundLike.getLikeStatus();

        return {
          ...post,
          extendedLikesinfo: {
            ...post.extendedLikesinfo,
            myStatus,
          },
        };
      }),
    };
  }
}
