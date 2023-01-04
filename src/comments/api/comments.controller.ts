import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/repository/comments.query.repository';
import { CommentViewModel } from '../infrastructure/models/view.models';
import { CommentInputModelType } from './models/input.models';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':commentId')
  async getCommentById(
    @Param() params: { commentId: string },
  ): Promise<CommentViewModel> {
    const comment = await this.commentsQueryRepository.getCommentById(
      params.commentId,
    );
    if (!comment) {
      throw new NotFoundException('comment not found');
    }
    return this.commentsQueryRepository.getCommentById(params.commentId);
  }

  @Put(':commentId')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async updateComment(
    @Param() params: { commentId: string },
    @Body() commentInputModel: CommentInputModelType,
  ): Promise<undefined> {
    await this.commentsService.updateComment(
      params.commentId,
      commentInputModel,
    );
    return;
  }
  @Delete(':commentId')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteComment(
    @Param() params: { commentId: string },
  ): Promise<undefined> {
    await this.commentsService.deleteComment(params.commentId);
    return;
  }
}
