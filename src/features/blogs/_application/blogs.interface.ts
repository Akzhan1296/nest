import { BlogItemDBType, BlogItemType } from '../_infrastructure/blogs.type';
import { BlogUpdateType } from './dto/blogs.dto';

// for repository
export abstract class BlogsStateRepository {
  abstract getBlogById(id: string): Promise<BlogItemDBType | null>;
  abstract createBlog(dto: BlogItemType): Promise<BlogItemDBType>;
  abstract updateBlog(id: string, dto: BlogUpdateType): Promise<boolean>;
  abstract deleteBlog(id: string): Promise<boolean>;
}
