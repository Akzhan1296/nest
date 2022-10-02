import { Controller, Get, Param } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs.query.repository';

@Controller('blogs')
export class BlogsQueryController {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}
  @Get()
  async getBlogs() {
    return await this.blogsQueryRepository.getBlogs();
  }
  @Get(':id')
  getBlogsById(@Param() params: { id: ObjectId }) {
    return this.blogsQueryRepository.getBlogById(params.id);
  }
  @Get()
  getBlogPosts() {
    return [];
  }
}
