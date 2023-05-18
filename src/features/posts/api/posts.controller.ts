import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/repository/comments.query.repository';
import { CommentViewModel } from 'src/features/comments/infrastructure/models/view.models';
import { CreateCommentInputModel, PostLikeStatus } from './models/input.models';
import { AuthGuard } from '../../../guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../../comments/application/use-cases/create-comment-use-case';
import { HandlePostsLikesCommand } from '../../likes/application/use-cases/handle-posts-likes';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  // post comment
  @Post(':postId/comments')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async createCommentForSelectedPost(
    @Req() request: Request,
    @Param() params: { postId: string },
    @Body() commentInputModel: CreateCommentInputModel,
  ): Promise<CommentViewModel> {
    const comment = await this.commandBus.execute(
      new CreateCommentCommand({
        postId: params.postId,
        userId: request.body.userId,
        content: commentInputModel.content,
      }),
    );

    const commentViewModel = await this.commentsQueryRepository.getCommentById(
      comment._id.toString(),
    );
    return commentViewModel;
  }

  // like-status
  @Put(':postId/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async postStatus(
    @Req() request: Request,
    @Param() params: { postId: string },
    @Body() postLikeStatus: PostLikeStatus,
  ) {
    return this.commandBus.execute(
      new HandlePostsLikesCommand({
        postId: params.postId,
        postLikeStatus: postLikeStatus.likeStatus,
        userId: request.body.userId,
        login: request.body.login,
      }),
    );
  }
}
