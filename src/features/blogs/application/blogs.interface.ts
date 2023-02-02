import { BlogItemDBType, BlogItemType } from '../infrastructure/blogs.type';
import { BlogType } from './dto/blogs.dto';

// for repository
export abstract class BlogsStateRepository {
  abstract getBlogById(id: string): Promise<BlogItemDBType | null>;
  abstract createBlog(dto: BlogItemType): Promise<BlogItemDBType>;
  abstract updateBlog(id: string, dto: BlogType): Promise<boolean>;
  abstract deleteBlog(id: string): Promise<boolean>;
}
