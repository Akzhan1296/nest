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
import { CommentInputModelType } from './models/input.models';
import { AuthGuard } from '../../../guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/use-cases/update-comment-use-case';
import { DeleteCommentCommand } from '../application/use-cases/delete-comment-use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commandBus: CommandBus,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':commentId')
  async getCommentById(
    @Param() params: { commentId: string },
  ): Promise<CommentViewModel> {
    const comment = await this.commentsQueryRepository.getCommentById(
      params.commentId,
    );
    if (!comment) throw new NotFoundException('comment not found');
    return this.commentsQueryRepository.getCommentById(params.commentId);
  }

  @Put(':commentId')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async updateComment(
    @Req() request: Request,
    @Param() params: { commentId: string },
    @Body() commentInputModel: CommentInputModelType,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new UpdateCommentCommand({
        commentId: params.commentId,
        userId: request.body.userId,
        content: commentInputModel.content,
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
