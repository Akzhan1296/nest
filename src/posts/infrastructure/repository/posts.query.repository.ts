import { Injectable } from '@nestjs/common';
import { PostsQueryStateRepository } from 'src/posts/application/posts.query.interface';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PostItemType } from '../posts.type';
import { InjectModel } from '@nestjs/mongoose';
import { PostViewModel } from './models/view.models';

@Injectable()
export class PostsQueryRepository implements PostsQueryStateRepository {
  constructor(
    @InjectModel(PostItemType.name)
    private postModel: Model<PostItemType>,
  ) {}
  async getPostsByBlogId(blogId: string): Promise<PostViewModel[]> {
    const filter = { blogId: new ObjectId(blogId) };
    const postsByBlogId = await this.postModel.find(filter);
    return postsByBlogId.map((post) => ({
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      id: post._id.toString(),
      content: post.content,
      createdAt: post.createdAt,
      shortDescription: post.shortDescription,
      title: post.title,
    }));
  }
  async getPosts(): Promise<PostViewModel[]> {
    const posts = await this.postModel.find();
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
  async getPostById(id: ObjectId): Promise<PostViewModel | null> {
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
}
