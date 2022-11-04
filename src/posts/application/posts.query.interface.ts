import { ObjectId } from 'mongodb';
import { PostViewModel } from '../infrastructure/posts.type';

export abstract class PostsQueryStateRepository {
  abstract getPostsByBlogId(blogId: string): Promise<PostViewModel[]>;
  abstract getPosts(): Promise<PostViewModel[]>;
  abstract getPostById(id: ObjectId): Promise<PostViewModel | null>;
}
