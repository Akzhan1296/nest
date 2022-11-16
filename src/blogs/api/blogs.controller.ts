import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from 'src/posts/application/posts.service';
import { PostViewModel } from 'src/posts/infrastructure/repository/models/view.models';
import { PostsQueryRepository } from 'src/posts/infrastructure/repository/posts.query.repository';
import { BlogsService } from '../application/blogs.services';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs.query.repository';
import { BlogViewModel } from '../infrastructure/repository/models/view.models';
import {
  BlogInputModelType,
  CreatePostByBlogIdInputType,
} from './models/input.models';

@Controller('blogs')
export class BlogsController {
  constructor(
    @Inject(BlogsService.name)
    protected blogsService: BlogsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    @Inject(PostsService.name)
    protected postService: PostsService,
    protected postQuerysRepository: PostsQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() blogInputModel: BlogInputModelType,
  ): Promise<BlogViewModel> {
    const blog = await this.blogsService.createBlog(blogInputModel);
    const viewModel = await this.blogsQueryRepository.getBlogById(
      blog._id.toString(),
    );
    return viewModel;
  }
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param() params: { id: string },
    @Body() blogInputModel: BlogInputModelType,
  ): Promise<undefined> {
    const blog = await this.blogsQueryRepository.getBlogById(params.id);
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    await this.blogsService.updateBlog(params.id, blogInputModel);
    return;
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param() params: { id: string }): Promise<undefined> {
    const blog = await this.blogsQueryRepository.getBlogById(params.id);
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    await this.blogsService.deleteBlog(params.id);
    return;
  }
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostByBlogId(
    @Param() params: { blogId: string },
    @Body() postInputModel: CreatePostByBlogIdInputType,
  ): Promise<PostViewModel> {
    const blog = await this.blogsQueryRepository.getBlogById(params.blogId);
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    const postByBlogId = await this.postService.createPost({
      ...postInputModel,
      blogId: params.blogId,
    });
    return await this.postQuerysRepository.getPostById(
      postByBlogId._id.toString(),
    );
  }
}
