import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/repository/comments.query.repository';
import { CommentViewModel } from '../infrastructure/repository/models/view.models';
import { CommentInputModelType } from './models/input.models';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':commentId')
  async getBlogsById(
    @Param() params: { commentId: ObjectId },
  ): Promise<CommentViewModel> {
    return this.commentsQueryRepository.getCommentById(params.commentId);
  }

  @Put(':commentId')
  async updateComment(
    @Param() params: { commentId: ObjectId },
    @Body() commentInputModel: CommentInputModelType,
  ): Promise<boolean> {
    return await this.commentsService.updateComment(
      params.commentId,
      commentInputModel,
    );
  }
  @Delete(':commentId')
  async deleteComment(
    @Param() params: { commentId: ObjectId },
  ): Promise<boolean> {
    console.log(params.commentId);
    return await this.commentsService.deleteComment(params.commentId);
  }
}
