import { BlogItemDBType } from '../infrastructure/blogs.type';
import { ObjectId } from 'mongoose';

export abstract class BlogsQueryStateRepository {
  abstract getBlogById(id: ObjectId): Promise<BlogItemDBType | null>;
  abstract getBlogs(): Promise<BlogItemDBType[]>;
}
