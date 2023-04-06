import { Injectable } from '@nestjs/common';
import { PostsQueryStateRepository } from 'src/features/posts/application/posts.query.interface';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { PostViewModel } from './models/view.models';
import { Paginated } from '../../../../common/utils';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../../../common/common-types';
import { Post, PostDocument } from '../../schema/posts.schema';

@Injectable()
export class PostsQueryRepository implements PostsQueryStateRepository {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  private async getPostsCount(filter: any = {}): Promise<number> {
    return this.postModel.count(filter);
  }
  private getPostsViewModel(posts: PostDocument[]): PostViewModel[] {
    return posts.map((post) => ({
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      id: post._id.toString(),
      content: post.content,
      createdAt: post.createdAt,
      shortDescription: post.shortDescription,
      title: post.title,
      extendedLikesInfo: {
        dislikesCount: post.dislikeCount,
        likesCount: post.likeCount,
        myStatus: 'None',
        newestLikes: post.getNewestLikes(),
      },
    }));
  }
  private async getPaginatedPosts(
    pageParams: PageSizeQueryModel,
    posts: PostDocument[],
    filter: any = {},
  ): Promise<PaginationViewModel<PostViewModel>> {
    return Paginated.transformPagination<PostViewModel>(
      { ...pageParams, totalCount: await this.getPostsCount(filter) },
      this.getPostsViewModel(posts),
    );
  }

  async getPostsByBlogId(
    pageParams: PageSizeQueryModel,
    blogId: string,
  ): Promise<PaginationViewModel<PostViewModel>> {
    const { skip, pageSize, sortBy, sortDirection } = pageParams;
    const filter = { blogId: new ObjectId(blogId) };

    const postsByBlogId = await this.postModel
      .find(filter)
      .skip(skip)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .limit(pageSize);

    return this.getPaginatedPosts(pageParams, postsByBlogId, filter);
  }
  async getPosts(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<PostViewModel>> {
    const { skip, pageSize, sortBy, sortDirection } = pageParams;
    const posts = await this.postModel
      .find()
      .skip(skip)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .limit(pageSize);

    return this.getPaginatedPosts(pageParams, posts);
  }
  async getPostById(id: string): Promise<PostViewModel | null> {
    const post = await this.postModel.findById(id);

    if (post) {
      return {
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        id: post._id.toString(),
        content: post.content,
        createdAt: post.createdAt,
        shortDescription: post.shortDescription,
        title: post.title,
        extendedLikesInfo: {
          dislikesCount: post.dislikeCount,
          likesCount: post.likeCount,
          myStatus: 'None',
          newestLikes: post.getNewestLikes(),
        },
      };
    }
    return null;
  }
  async dropPosts() {
    return this.postModel.deleteMany({});
  }
}
