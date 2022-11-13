import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PostsService } from 'src/posts/application/posts.service';
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
  async createBlog(
    @Body() blogInputModel: BlogInputModelType,
  ): Promise<BlogViewModel> {
    const blog = await this.blogsService.createBlog(blogInputModel);
    const viewModel = await this.blogsQueryRepository.getBlogById(blog._id);
    return viewModel;
  }
  @Put(':id')
  async updateBlog(
    @Param() params: { id: ObjectId },
    @Body() blogInputModel: BlogInputModelType,
  ): Promise<boolean> {
    return await this.blogsService.updateBlog(params.id, blogInputModel);
  }
  @Delete(':id')
  async deleteBlog(@Param() params: { id: ObjectId }): Promise<boolean> {
    return await this.blogsService.deleteBlog(params.id);
  }
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param() params: { blogId: ObjectId },
    @Body() postInputModel: CreatePostByBlogIdInputType,
  ) {
    const postByBlogId = await this.postService.createPost({
      ...postInputModel,
      blogId: params.blogId,
    });
    const postsViewModel = await this.postQuerysRepository.getPostsByBlogId(
      postByBlogId.blogId.toString(),
    );
    return postsViewModel;
  }
}
