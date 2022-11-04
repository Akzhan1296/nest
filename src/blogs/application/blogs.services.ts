import { BlogItemDBType, BlogItemType } from '../infrastructure/blogs.type';
import { ObjectId } from 'mongodb';
import { BlogsStateRepository } from './blogs.interface';
import { BlogType } from './dto/blogs.dto';
export class BlogsService {
  constructor(protected blogRepository: BlogsStateRepository) {}
  createBlog(dto: BlogType): Promise<BlogItemDBType> {
    const newBlog = new BlogItemType(dto.name, dto.youtubeUrl, new Date());
    return this.blogRepository.createBlog(newBlog);
  }
  async updateBlog(id: ObjectId, dto: BlogType): Promise<boolean> {
    let isBlogUpdated = false;
    const blog = await this.blogRepository.getBlogById(id);
    if (blog) {
      isBlogUpdated = await this.blogRepository.updateBlog(id, dto);
    }
    return isBlogUpdated;
  }
  async deleteBlog(id: ObjectId): Promise<boolean> {
    let isBlogDeleted = false;
    const blog = await this.blogRepository.getBlogById(id);
    if (blog) {
      isBlogDeleted = await this.blogRepository.deleteBlog(id);
    }
    return isBlogDeleted;
  }
}
