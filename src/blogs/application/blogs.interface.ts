import { BlogItemDBType, BlogItemType } from '../infrastructure/blogs.type';
import { ObjectId } from 'mongodb';
import { BlogType } from './dto/blogs.dto';

export abstract class BlogsStateRepository {
  abstract getBlogById(id: ObjectId): Promise<BlogItemDBType | null>;
  abstract createBlog(dto: BlogItemType): Promise<BlogItemDBType>;
  abstract updateBlog(id: ObjectId, dto: BlogType): Promise<boolean>;
  abstract deleteBlog(id: ObjectId): Promise<boolean>;
}
