import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/entity/comments.schema';
import { CommentsRepository } from '../../infrastructure/repository/comments.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @InjectModel(Comment.name)
    protected commentsRepository: CommentsRepository,
  ) {}

  async deleteComment(userId: string, id: string): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(id);
    if (!comment) throw new NotFoundException('comment not found');
    if (comment.userId.toString() !== userId)
      throw new ForbiddenException('not your comment');
    return this.commentsRepository.delete(comment);
  }
}
