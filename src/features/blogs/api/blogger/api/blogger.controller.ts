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
import { BlogsQueryRepository } from '../../../_infrastructure/repository/blogs.query.repository';
import { PaginationViewModel } from '../../../../../common/common-types';

import { BannedUserForBlog, BlogViewModel } from '../../../_models/view.models';
import {
  BanUserForBlogInputModal,
  BlogInputModelType,
  BlogsQueryType,
  CreatePostByBlogIdInputType,
} from '../../../_models/input.models';
import { AuthGuard } from '../../../../../guards/auth.guard';
import { UpdatePostInputModel } from './models';
import { UserIdGuard } from '../../../../../guards/userId';
import { PostsQueryService } from '../../../../posts/api/posts.query.service';
import { CommandBus } from '@nestjs/cqrs';
import { BanUserForBlogCommand } from '../application/ban-user-for-blog';
import { BanUserBlogResultDTO } from '../application/ban-user.dto';
import { BlogsQueryServiceRepository } from '../../../_infrastructure/repository/blogs.query.service';
import { BanBlogsRepository } from '../../../_infrastructure/repository/blogs-ban.repository';
import { BlogsRepository } from '../../../_infrastructure/repository/blogs.repository';

@UseGuards(AuthGuard)
@Controller('blogger/blogs')
export class BlogsController {
  constructor(
    @Inject(BlogsService.name)
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsQueryServiceRepository: BlogsQueryServiceRepository,
    @Inject(PostsService.name)
    private readonly postService: PostsService,
    private readonly postQuerysRepository: PostsQueryRepository,
    private readonly postsQueryService: PostsQueryService,
  ) {}

  // update blog
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param() params: { id: string },
    @Req() request: Request,
    @Body() blogInputModel: BlogInputModelType,
  ): Promise<boolean> {
    const checkingResult =
      await this.blogsService.checkBlockBeforeUpdateOrDelete({
        blogId: params.id,
        userId: request.body.userId,
      });
    if (!checkingResult.isBlogFound) throw new NotFoundException();
    if (checkingResult.isForbidden) throw new ForbiddenException();
    return await this.blogsService.updateBlog(params.id, blogInputModel);
  }
  // delete
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(
    @Param() params: { id: string },
    @Req() request: Request,
  ): Promise<boolean> {
    const checkingResult =
      await this.blogsService.checkBlockBeforeUpdateOrDelete({
        blogId: params.id,
        userId: request.body.userId,
      });
    if (!checkingResult.isBlogFound) throw new NotFoundException();
    if (checkingResult.isForbidden) throw new ForbiddenException();

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
      userLogin: request.body.login,
    });
    const { isBanned, ...rest } = await this.blogsQueryRepository.getBlogById(
      blog._id.toString(),
    );
    return rest;
  }

  // get blogs
  @Get()
  async getBlogs(
    @Query() pageSize: BlogsQueryType,
    @Req() request: Request,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    return await this.blogsQueryRepository.getBloggerBlogs(
      pageSize,
      request.body.userId,
    );
  }

  // create post by blog id
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostByBlogId(
    @Param() params: { blogId: string },
    @Body() postInputModel: CreatePostByBlogIdInputType,
    @Req() request: Request,
  ): Promise<PostViewModel> {
    const checkingResult =
      await this.blogsService.checkBlockBeforeUpdateOrDelete({
        blogId: params.blogId,
        userId: request.body.userId,
      });
    if (!checkingResult.isBlogFound) throw new NotFoundException();
    if (checkingResult.isForbidden) throw new ForbiddenException();

    const postByBlogId = await this.postService.createPost({
      ...postInputModel,
      blogId: params.blogId,
      userId: request.body.userId,
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
    @Body() postsInputModel: UpdatePostInputModel,
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
      userId: request.body.userId,
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

  // get blog posts
  @HttpCode(200)
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
    if (blog.isBanned) {
      throw new NotFoundException('blog not found');
    }
    return await this.postsQueryService.getPostsWithLikeByblogId(
      pageSize,
      request.body.userId,
      params.blogId,
    );
  }

  // get blog all comments
  @HttpCode(200)
  @Get('comments')
  async getBlogPostsAllComments(
    @Query() pageSize: BlogsQueryType,
    @Req() request: Request,
  ) {
    return this.blogsQueryServiceRepository.getCommentAll(
      pageSize,
      request.body.userId,
    );
  }
}

@UseGuards(AuthGuard)
@Controller('blogger/users')
export class BlogsUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly banBlogsRepository: BanBlogsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  // ban user for specific blog
  @Put(':userId/ban')
  @HttpCode(204)
  async banBlog(
    @Param() params: { userId: string },
    @Body() banUserForBlogInputModel: BanUserForBlogInputModal,
    @Req() request: Request,
  ): Promise<boolean> {
    const banUserResult: BanUserBlogResultDTO = await this.commandBus.execute(
      new BanUserForBlogCommand({
        ...banUserForBlogInputModel,
        userId: params.userId,
        ownerId: request.body.userId, //from token
      }),
    );
    if (!banUserResult.isUserFound) throw new NotFoundException();
    if (banUserResult.isFoubidden) throw new ForbiddenException();

    return banUserResult.isUserBanned;
  }

  // get banned users list
  @Get('blog/:blogId')
  async getBlogs(
    @Query() pageSize: BlogsQueryType,
    @Param() params: { blogId: string },
    @Req() request: Request,
  ): Promise<PaginationViewModel<BannedUserForBlog>> {
    const blog = await this.blogsRepository.getBlogById(params.blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.ownerId.toString() !== request.body.userId.toString()) {
      throw new ForbiddenException();
    }

    return await this.banBlogsRepository.getBloggerBannedUsers(
      pageSize,
      params.blogId,
    );
  }
}
