import { Controller, Get, Param } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PostsQueryRepository } from 'src/posts/infrastructure/repository/posts.query.repository';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs.query.repository';
import { BlogViewModel } from '../infrastructure/repository/models/view.models';

@Controller('blogs')
export class BlogsQueryController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}
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
  @Get(':blogId/posts')
  async getBlogPosts(@Param() params: { blogId: string }) {
    return await this.postsQueryRepository.getPostsByBlogId(params.blogId);
  }
}
