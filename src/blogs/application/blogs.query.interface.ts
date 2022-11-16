import { BlogViewModel } from '../infrastructure/repository/models/view.models';

export abstract class BlogsQueryStateRepository {
  abstract getBlogById(id: string): Promise<BlogViewModel | null>;
  abstract getBlogs(): Promise<BlogViewModel[]>;
}
