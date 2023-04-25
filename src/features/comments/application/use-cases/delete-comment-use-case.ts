import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/repository/comments.repository';
import { DeleteCommentDTO } from '../dto/comments.dto';

export class DeleteCommentCommand {
  deleteCommentDTO: DeleteCommentDTO;
  constructor(props: DeleteCommentDTO) {
    this.deleteCommentDTO = props;
  }
}
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(
      command.deleteCommentDTO.commentId,
    );
    if (!comment) throw new NotFoundException('comment not found');
    if (comment.userId.toString() !== command.deleteCommentDTO.userId)
      throw new ForbiddenException('not your comment');
    return this.commentsRepository.delete(comment);
  }
}
