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
import { BlogsQueryRepository } from '../../infrastructure/repository/blogs.query.repository';

@Controller('sa/blogs')
export class BlogsSAController {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
  @Get()
  async getBlogs(
    @Query() pageSize: BlogsQueryType,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    return await this.blogsQueryRepository.getBlogs(pageSize);
  }
}
