import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../domain/entity/comments.schema';
import {
  CreateCommentDTO,
  CreateCommentWithUserLogin,
} from './../dto/comments.dto';
import { ObjectId } from 'mongodb';
import { CommentsRepository } from '../../infrastructure/repository/comments.repository';
import { PostsRepository } from '../../../posts/infrastructure/repository/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';

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
    protected usersRepository: UsersRepository,
  ) {}

  // domain factory
  private createComment(
    createCommentDTO: CreateCommentWithUserLogin,
  ): CommentDocument {
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
    const user = await this.usersRepository.findUserById(
      command.createCommentDTO.userId.toString(),
    );
    if (!user) throw new NotFoundException('user not found');

    //new comment entity
    const newComment = this.createComment({
      ...command.createCommentDTO,
      userId: new ObjectId(command.createCommentDTO.userId),
      userLogin: user.getLogin(),
    });
    await this.commentsRepository.save(newComment);
    return newComment;
  }
}
