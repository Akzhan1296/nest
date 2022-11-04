import { ObjectId } from 'mongodb';
import { BlogViewModel } from '../infrastructure/repository/models/view.models';

export abstract class BlogsQueryStateRepository {
  abstract getBlogById(id: ObjectId): Promise<BlogViewModel | null>;
  abstract getBlogs(): Promise<BlogViewModel[]>;
}
