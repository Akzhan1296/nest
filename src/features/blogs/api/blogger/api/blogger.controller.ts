import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from '../../../../posts/application/posts.service';
import { PostViewModel } from '../../../../posts/infrastructure/repository/models/view.models';
import { PostsQueryRepository } from '../../../../posts/infrastructure/repository/posts.query.repository';
import { BlogsService } from '../application/blogs.services';
import { BlogsQueryRepository } from '../../../infrastructure/repository/blogs.query.repository';
import { PaginationViewModel } from '../../../../../common/common-types';

import { BlogViewModel } from '../../../_models/view.models';
import {
  BlogInputModelType,
  BlogsQueryType,
  CreatePostByBlogIdInputType,
} from '../../../_models/input.models';
import { AuthGuard } from '../../../../../guards/auth.guard';
import { PostInputModel } from './models';

@UseGuards(AuthGuard)
@Controller('blogger/blogs')
export class BlogsController {
  constructor(
    @Inject(BlogsService.name)
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    @Inject(PostsService.name)
    private readonly postService: PostsService,
    private readonly postQuerysRepository: PostsQueryRepository,
  ) {}

  // update blog
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param() params: { id: string },
    @Body() blogInputModel: BlogInputModelType,
  ): Promise<boolean> {
    return await this.blogsService.updateBlog(params.id, blogInputModel);
  }
  // delete
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param() params: { id: string }): Promise<boolean> {
    return await this.blogsService.deleteBlog(params.id);
  }

  // create new blog
  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() blogInputModel: BlogInputModelType,
    @Req() request: Request,
  ): Promise<BlogViewModel> {
    const blog = await this.blogsService.createBlog({
      ...blogInputModel,
      userId: request.body.userId,
    });
    return await this.blogsQueryRepository.getBlogById(blog._id.toString());
  }

  // get blogs
  @Get()
  async getBlogs(
    @Query() pageSize: BlogsQueryType,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    return await this.blogsQueryRepository.getBlogs(pageSize);
  }

  // create post by blog id
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostByBlogId(
    @Param() params: { blogId: string },
    @Body() postInputModel: CreatePostByBlogIdInputType,
  ): Promise<PostViewModel> {
    const postByBlogId = await this.postService.createPost({
      ...postInputModel,
      blogId: params.blogId,
    });
    return await this.postQuerysRepository.getPostById(
      postByBlogId._id.toString(),
    );
  }

  //update post by blog id
  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePostByBlogId(
    @Param() params: { blogId: string; postId: string },
    @Body() postsInputModel: PostInputModel,
    @Req() request: Request,
  ) {
    const checkingResult =
      await this.blogsService.checkBlockBeforeUpdateOrDelete({
        blogId: params.blogId,
        postId: params.postId,
        userId: request.body.userId,
      });

    if (!checkingResult.isBlogFound) throw new NotFoundException();
    if (!checkingResult.isPostFound) throw new NotFoundException();
    if (checkingResult.isForbidden) throw new ForbiddenException();
    return this.postService.updatePost(params.postId, {
      ...postsInputModel,
      blogId: params.blogId,
    });
  }

  //delete post by blog id
  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePostByBlogId(
    @Param() params: { blogId: string; postId: string },
    @Req() request: Request,
  ) {
    const checkingResult =
      await this.blogsService.checkBlockBeforeUpdateOrDelete({
        blogId: params.blogId,
        postId: params.postId,
        userId: request.body.userId,
      });

    if (!checkingResult.isBlogFound) throw new NotFoundException();
    if (!checkingResult.isPostFound) throw new NotFoundException();
    if (checkingResult.isForbidden) throw new ForbiddenException();
    return await this.postService.deletePost(params.postId);
  }

  //update post

  // add ownerId for blog entity

  // in application check
  // add server method which will check is ownerId and userId from token same ?
  // if no return 403 forbidden or skip it

  //delete post
}
