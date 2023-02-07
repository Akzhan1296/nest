import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../domain/entity/comments.schema';
import { CreateCommentDTO } from './../dto/comments.dto';
import { CommentsRepository } from '../../infrastructure/repository/comments.repository';
import { PostsRepository } from '../../../posts/infrastructure/repository/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateCommentCommand {
  constructor(public createCommentDTO: CreateCommentDTO) {}
}
@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
  ) {}

  // domain factory
  private createComment(createCommentDTO: CreateCommentDTO): CommentDocument {
    const contentLength = createCommentDTO.content.length;
    if (contentLength < 20 || contentLength > 300)
      throw new BadRequestException('length error');
    return new this.CommentModel(createCommentDTO);
  }

  async execute(command: CreateCommentCommand): Promise<CommentDocument> {
    const post = await this.postsRepository.getPostById(
      command.createCommentDTO.postId,
    );
    if (!post) throw new NotFoundException('post not found');
    const newComment = this.createComment(command.createCommentDTO);
    await this.commentsRepository.save(newComment);
    return newComment;
  }
}
