import { BlogItemDBType, BlogType } from '../infrastructure/blogs.type';
import { ObjectId } from 'mongoose';

export abstract class BlogsStateRepository {
  abstract createBlog(dto: BlogType): Promise<BlogItemDBType>;
  abstract updateBlog(id: ObjectId, dto: BlogType): Promise<boolean>;
  abstract deleteBlog(id: ObjectId): Promise<boolean>;
}
