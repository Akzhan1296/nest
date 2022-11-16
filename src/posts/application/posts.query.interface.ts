import { PostViewModel } from '../infrastructure/repository/models/view.models';

export abstract class PostsQueryStateRepository {
  abstract getPostsByBlogId(blogId: string): Promise<PostViewModel[]>;
  abstract getPosts(): Promise<PostViewModel[]>;
  abstract getPostById(id: string): Promise<PostViewModel | null>;
}
