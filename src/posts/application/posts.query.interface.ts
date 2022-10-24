import { ObjectId } from 'mongodb';
import { PostViewModel } from '../infrastructure/posts.type';

export abstract class PostsQueryStateRepository {
  abstract getPostByBlogId(blogId: ObjectId): Promise<string[]>;
  abstract getPosts(): Promise<PostViewModel[]>;
  abstract getPostById(id: ObjectId): Promise<PostViewModel | null>;
}
