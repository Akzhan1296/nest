import { Injectable } from '@nestjs/common';
import { PostsQueryStateRepository } from 'src/posts/application/posts.query.interface';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PostItemType, PostViewModel } from '../posts.type';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsQueryRepository implements PostsQueryStateRepository {
  constructor(
    @InjectModel(PostItemType.name)
    private postModel: Model<PostItemType>,
  ) {}
  async getPostByBlogId(blogId: ObjectId): Promise<string[]> {
    console.log(blogId);
    return [];
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
