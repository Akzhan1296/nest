import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationViewModel } from '../../../../common/common-types';
import { BlogSAViewModel } from '../../_models/view.models';
import { BlogsQueryType } from '../../_models/input.models';
import { BlogsQueryRepository } from '../../_infrastructure/repository/blogs.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { BanBlogInputModal } from './sa.input.models';
import { BanBlogBySACommand } from './application/ban-blog-use-case';
import { AuthGuard } from '../../../../guards/auth.guard';

@Controller('sa/blogs')
export class BlogsSAController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get()
  @HttpCode(200)
  async getBlogs(
    @Query() pageSize: BlogsQueryType,
  ): Promise<PaginationViewModel<BlogSAViewModel>> {
    return await this.blogsQueryRepository.getBlogsSA(pageSize);
  }

  //ban user
  @UseGuards(AuthGuard)
  @Put(':blogId/ban')
  @HttpCode(204)
  async banUser(
    @Param() params: { blogId: string },
    @Body() inputModel: BanBlogInputModal,
  ) {
    return await this.commandBus.execute(
      new BanBlogBySACommand({
        isBanned: inputModel.isBanned,
        blogId: params.blogId,
      }),
    );
  }
}
