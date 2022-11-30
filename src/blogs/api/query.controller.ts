import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from 'src/common/common-types';
import { QueryParamsPipe } from 'src/common/query-param-pipes';
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
  async getBlogs(
    @Query(new QueryParamsPipe()) pageSize: PageSizeQueryModel,
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
  @Get(':blogId/posts')
  async getBlogPosts(
    @Query(new QueryParamsPipe()) pageSize: PageSizeQueryModel,
    @Param() params: { blogId: string },
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(params.blogId);
    if (!blog) {
      throw new NotFoundException('posts by blogid not found');
    }
    return await this.postsQueryRepository.getPostsByBlogId(
      pageSize,
      params.blogId,
    );
  }
}
