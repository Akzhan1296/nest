import { Controller, Get, Query } from '@nestjs/common';
import { PaginationViewModel } from '../../../../common/common-types';
import { BlogSAViewModel } from '../../_models/view.models';
import { BlogsQueryType } from '../../_models/input.models';
import { BlogsQueryRepository } from '../../infrastructure/repository/blogs.query.repository';

@Controller('sa/blogs')
export class BlogsSAController {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
  @Get()
  async getBlogs(
    @Query() pageSize: BlogsQueryType,
  ): Promise<PaginationViewModel<BlogSAViewModel>> {
    return await this.blogsQueryRepository.getBlogsSA(pageSize);
  }
}
