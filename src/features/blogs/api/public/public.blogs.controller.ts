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
import { PaginationViewModel } from '../../../../common/common-types';
import { BlogViewModel } from '../../_models/view.models';
import { BlogsQueryType } from '../../_models/input.models';
import { UserIdGuard } from '../../../../guards/userId';
import { PostsQueryService } from '../../../posts/api/posts.query.service';
import { PostViewModel } from '../../../posts/infrastructure/repository/models/view.models';
import { BlogsQueryRepository } from '../../infrastructure/repository/blogs.query.repository';

@Controller('blogs')
export class BlogsPublicQueryController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryService: PostsQueryService,
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
