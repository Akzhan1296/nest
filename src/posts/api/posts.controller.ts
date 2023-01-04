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
import { CommentsService } from 'src/comments/application/comments.service';
import { CommentsQueryRepository } from 'src/comments/infrastructure/repository/comments.query.repository';
import { CommentViewModel } from 'src/comments/infrastructure/models/view.models';
import { PostsService } from '../application/posts.service';
import { PostViewModel } from '../infrastructure/repository/models/view.models';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';
import { CreateCommentInputModel, PostInputModel } from './models/input.models';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthBasicGuard } from '../../guards/authBasic.guard';

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
    const post = await this.postService.createPost(postsInputModel);
    const viewModel = this.postQuerysRepository.getPostById(
      post._id.toString(),
    );
    return viewModel;
  }

  @Put(':id')
  @UseGuards(AuthBasicGuard)
  @HttpCode(204)
  async updatePost(
    @Param() params: { id: string },
    @Body() postsInputModel: PostInputModel,
  ) {
    this.postService.updatePost(params.id, postsInputModel);
    return;
  }

  @Delete(':id')
  @UseGuards(AuthBasicGuard)
  @HttpCode(204)
  async deletePost(@Param() params: { id: string }) {
    this.postService.deletePost(params.id);
    return;
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
