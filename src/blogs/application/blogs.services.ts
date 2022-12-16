import { NotFoundException } from '@nestjs/common';
import { BlogItemDBType, BlogItemType } from '../infrastructure/blogs.type';
import { BlogsStateRepository } from './blogs.interface';
import { BlogType } from './dto/blogs.dto';
export class BlogsService {
  constructor(protected blogRepository: BlogsStateRepository) {}
  createBlog(dto: BlogType): Promise<BlogItemDBType> {
    const newBlog = new BlogItemType(
      dto.name,
      dto.websiteUrl,
      new Date(),
      dto.description,
    );
    return this.blogRepository.createBlog(newBlog);
  }
  async updateBlog(id: string, dto: BlogType): Promise<boolean> {
    const blog = await this.blogRepository.getBlogById(id);
    if (blog) {
      return await this.blogRepository.updateBlog(id, dto);
    } else {
      throw new NotFoundException('blog not found');
    }
  }
  async deleteBlog(id: string): Promise<boolean> {
    const blog = await this.blogRepository.getBlogById(id);
    if (blog) {
      return await this.blogRepository.deleteBlog(id);
    } else {
      throw new NotFoundException('blog not found');
    }
  }
}
