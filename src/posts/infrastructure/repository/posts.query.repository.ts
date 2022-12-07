import { Injectable } from '@nestjs/common';
import { PostsQueryStateRepository } from 'src/posts/application/posts.query.interface';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PostItemDBType, PostItemType } from '../posts.type';
import { InjectModel } from '@nestjs/mongoose';
import { PostViewModel } from './models/view.models';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from 'src/common/common-types';
import { Paginated } from 'src/common/utils';

@Injectable()
export class PostsQueryRepository implements PostsQueryStateRepository {
  constructor(
    @InjectModel(PostItemType.name)
    private postModel: Model<PostItemType>,
  ) {}

  private async getPostsCount() {
    return this.postModel.count();
  }
  private getPostsViewModel(posts: PostItemDBType[]) {
    return posts.map((post) => ({
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      id: post._id.toString(),
      content: post.content,
      createdAt: post.createdAt,
      shortDescription: post.shortDescription,
      title: post.title,
    }));
  }
  private async getPaginatedPosts(
    pageParams: PageSizeQueryModel,
    posts: PostItemDBType[],
  ) {
    return Paginated.transformPagination<PostViewModel>(
      { ...pageParams, totalCount: await this.getPostsCount() },
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

    return this.getPaginatedPosts(pageParams, postsByBlogId);
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
    const post = await this.postModel.findById(id).lean();

    if (post) {
      return {
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        id: post._id.toString(),
        content: post.content,
        createdAt: post.createdAt,
        shortDescription: post.shortDescription,
        title: post.title,
      };
    }
    return null;
  }
  async dropPosts() {
    return this.postModel.collection.drop();
  }
}
