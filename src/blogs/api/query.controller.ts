import { Controller, Get, Param } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BlogViewModel } from '../infrastructure/blogs.type';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs.query.repository';

@Controller('blogs')
export class BlogsQueryController {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}
  @Get()
  async getBlogs(): Promise<BlogViewModel[]> {
    return await this.blogsQueryRepository.getBlogs();
  }
  @Get(':id')
  async getBlogsById(
    @Param() params: { id: ObjectId },
  ): Promise<BlogViewModel> {
    return this.blogsQueryRepository.getBlogById(params.id);
  }
  @Get()
  getBlogPosts() {
    return [];
  }
}
