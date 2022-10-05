import { Injectable } from '@nestjs/common';
import { PostsQueryStateRepository } from 'src/posts/application/posts.query.interface';
import { ObjectId, Model } from 'mongoose';
import { PostItemDBType, PostItemType } from '../posts.type';
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
  async getPosts(): Promise<PostItemDBType[]> {
    const posts = await this.postModel.find().lean();
    return posts.map((post) => ({
      blogId: post.blogId,
      blogName: post.blogName,
      id: post._id,
      content: post.content,
      createdAt: post.createdAt,
      shortDescription: post.shortDescription,
      title: post.title,
    }));
  }
  async getPostById(id: ObjectId) {
    const post = await this.postModel.findById(id).lean();

    if (post) {
      return {
        blogId: post.blogId,
        blogName: post.blogName,
        id: post._id,
        content: post.content,
        createdAt: post.createdAt,
        shortDescription: post.shortDescription,
        title: post.title,
      };
    }

    return null;
  }
}
