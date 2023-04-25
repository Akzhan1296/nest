import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { CommentsQueryRepository } from '../infrastructure/repository/comments.query.repository';
import { CommentViewModel } from '../infrastructure/models/view.models';
import {
  CommentInputModelType,
  CommentLikeStatus,
} from './models/input.models';
import { AuthGuard } from '../../../guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/use-cases/update-comment-use-case';
import { DeleteCommentCommand } from '../application/use-cases/delete-comment-use-case';
import { UserIdGuard } from '../../../guards/userId';
import { CommentsQueryService } from './query.service';
import { HandleCommentsLikesCommand } from '../../likes/application/use-cases/handle-comments-likes';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsQueryService: CommentsQueryService,
  ) {}

  @UseGuards(UserIdGuard)
  @Get(':commentId')
  async getCommentById(
    @Req() request: Request,
    @Param() params: { commentId: string },
  ): Promise<CommentViewModel> {
    return await this.commentsQueryService.getCommentById(
      params.commentId,
      request.body.userId,
    );
  }

  @Put(':commentId')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async updateComment(
    @Req() request: Request,
    @Param() params: { commentId: string },
    @Body() commentInputModel: CommentInputModelType,
  ): Promise<boolean> {
    // validate objectid
    return await this.commandBus.execute(
      new UpdateCommentCommand({
        commentId: params.commentId,
        userId: request.body.userId,
        content: commentInputModel.content,
      }),
    );
  }

  @Put(':commentId/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async likeStatus(
    @Req() request: Request,
    @Param() params: { commentId: string },
    @Body() commentLikeStatus: CommentLikeStatus,
  ) {
    return this.commandBus.execute(
      new HandleCommentsLikesCommand({
        commentId: params.commentId,
        commentLikeStatus: commentLikeStatus.likeStatus,
        userId: request.body.userId,
      }),
    );
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteComment(
    @Req() request: Request,
    @Param() params: { commentId: string },
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new DeleteCommentCommand({
        userId: request.body.userId,
        commentId: params.commentId,
      }),
    );
  }
}
