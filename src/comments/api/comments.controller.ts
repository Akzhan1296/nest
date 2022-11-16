import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/repository/comments.query.repository';
import { CommentViewModel } from '../infrastructure/models/view.models';
import { CommentInputModelType } from './models/input.models';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':commentId')
  async getBlogsById(
    @Param() params: { commentId: string },
  ): Promise<CommentViewModel> {
    return this.commentsQueryRepository.getCommentById(params.commentId);
  }

  @Put(':commentId')
  async updateComment(
    @Param() params: { commentId: string },
    @Body() commentInputModel: CommentInputModelType,
  ): Promise<boolean> {
    return await this.commentsService.updateComment(
      params.commentId,
      commentInputModel,
    );
  }
  @Delete(':commentId')
  async deleteComment(
    @Param() params: { commentId: string },
  ): Promise<boolean> {
    console.log(params.commentId);
    return await this.commentsService.deleteComment(params.commentId);
  }
}
