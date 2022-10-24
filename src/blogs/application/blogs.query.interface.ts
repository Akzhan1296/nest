import { BlogViewModel } from '../infrastructure/blogs.type';
import { ObjectId } from 'mongodb';

export abstract class BlogsQueryStateRepository {
  abstract getBlogById(id: ObjectId): Promise<BlogViewModel | null>;
  abstract getBlogs(): Promise<BlogViewModel[]>;
}
