import { ObjectId } from 'mongoose';
import { PostItemDBType } from '../infrastructure/posts.type';

export abstract class PostsQueryStateRepository {
  abstract getPostByBlogId(blogId: ObjectId): Promise<string[]>;
  abstract getPosts(): Promise<PostItemDBType[]>;
  abstract getPostById(id: ObjectId): Promise<PostItemDBType | null>;
}
