import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/repository/posts.query.repository';
import { PaginationViewModel } from '../../../common/common-types';
import { UserIdGuard } from '../../../guards/userId';
import { PostsQueryService } from '../../posts/api/posts.query.service';
import { PostViewModel } from '../../posts/infrastructure/repository/models/view.models';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs.query.repository';
import { BlogViewModel } from '../infrastructure/repository/models/view.models';
import { BlogsQueryType } from './models/input.models';

@Controller('blogs')
export class BlogsQueryController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected postsQueryService: PostsQueryService,
  ) {}
  @Get()
  async getBlogs(
    @Query() pageSize: BlogsQueryType,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    return await this.blogsQueryRepository.getBlogs(pageSize);
  }

  @Get(':id')
  async getBlogsById(
    @Param() params: { id: string },
  ): Promise<BlogViewModel | null> {
    const blog = await this.blogsQueryRepository.getBlogById(params.id);
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    return blog;
  }

  @UseGuards(UserIdGuard)
  @Get(':blogId/posts')
  async getBlogPosts(
    @Req() request: Request,
    @Query() pageSize: BlogsQueryType,
    @Param() params: { blogId: string },
  ): Promise<PaginationViewModel<PostViewModel>> {
    const blog = await this.blogsQueryRepository.getBlogById(params.blogId);
    if (!blog) {
      throw new NotFoundException('posts by blogid not found');
    }
    return await this.postsQueryService.getPostsWithLikeByblogId(
      pageSize,
      request.body.userId,
      params.blogId,
    );
  }
}
