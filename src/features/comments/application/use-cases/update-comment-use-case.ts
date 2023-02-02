import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/entity/comments.schema';
import { UpdateCommentDTO } from './../dto/comments.dto';
import { CommentsRepository } from '../../infrastructure/repository/comments.repository';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @InjectModel(Comment.name)
    protected commentsRepository: CommentsRepository,
  ) {}

  async updateComment(updateCommentDTO: UpdateCommentDTO): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(
      updateCommentDTO.commentId,
    );
    if (!comment) throw new NotFoundException('comment not found');
    if (comment.userId.toString() !== updateCommentDTO.userId)
      throw new ForbiddenException('not your comment');
    comment.setContent(updateCommentDTO.content);
    return this.commentsRepository.save(comment);
  }
}
