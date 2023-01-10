import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from 'src/features/comments/application/comments.service';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/repository/comments.query.repository';
import { CommentViewModel } from 'src/features/comments/infrastructure/models/view.models';
import { PostsService } from '../application/posts.service';
import { PostViewModel } from '../infrastructure/repository/models/view.models';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';
import { CreateCommentInputModel, PostInputModel } from './models/input.models';
import { AuthGuard } from '../../../guards/auth.guard';
import { AuthBasicGuard } from '../../../guards/authBasic.guard';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService.name)
    protected postService: PostsService,
    protected postQuerysRepository: PostsQueryRepository,
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post()
  @UseGuards(AuthBasicGuard)
  @HttpCode(201)
  async createPost(
    @Body() postsInputModel: PostInputModel,
  ): Promise<PostViewModel> {
    const newPost = await this.postService.createPost(postsInputModel);
    return this.postQuerysRepository.getPostById(newPost._id.toString());
  }

  @Put(':id')
  @UseGuards(AuthBasicGuard)
  @HttpCode(204)
  async updatePost(
    @Param() params: { id: string },
    @Body() postsInputModel: PostInputModel,
  ): Promise<boolean> {
    return this.postService.updatePost(params.id, postsInputModel);
  }

  @Delete(':id')
  @UseGuards(AuthBasicGuard)
  @HttpCode(204)
  async deletePost(@Param() params: { id: string }): Promise<boolean> {
    return this.postService.deletePost(params.id);
  }

  @Post(':postId/comments')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async createCommentForSelectedPost(
    @Req() request: Request,
    @Param() params: { postId: string },
    @Body() commentInputModel: CreateCommentInputModel,
  ): Promise<CommentViewModel> {
    const comment = await this.commentsService.createCommentForSelectedPost({
      postId: params.postId,
      userId: request.body.userId,
      content: commentInputModel.content,
    });
    return await this.commentsQueryRepository.getCommentById(
      comment._id.toString(),
    );
  }
}
