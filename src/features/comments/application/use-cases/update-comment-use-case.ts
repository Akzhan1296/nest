import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateCommentDTO } from './../dto/comments.dto';
import { CommentsRepository } from '../../infrastructure/repository/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateCommentCommand {
  constructor(public updateCommentDTO: UpdateCommentDTO) {}
}
@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(
      command.updateCommentDTO.commentId,
    );
    if (!comment) throw new NotFoundException('comment not found');
    if (comment.userId.toString() !== command.updateCommentDTO.userId)
      throw new ForbiddenException('not your comment');
    comment.setContent(command.updateCommentDTO.content);
    return this.commentsRepository.save(comment);
  }
}
