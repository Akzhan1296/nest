import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../domain/entity/comments.schema';
import { CreateCommentDTO } from './../dto/comments.dto';
import { CommentsRepository } from '../../infrastructure/repository/comments.repository';
import { PostsRepository } from '../../../posts/infrastructure/repository/posts.repository';

@Injectable()
export class CreateCommentUseCase {
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

  async createCommentForSelectedPost(
    createCommentDTO: CreateCommentDTO,
  ): Promise<CommentDocument> {
    const post = await this.postsRepository.getPostById(
      createCommentDTO.postId,
    );
    if (!post) throw new NotFoundException('post not found');
    const newComment = this.createComment(createCommentDTO);
    await this.commentsRepository.save(newComment);
    return newComment;
  }
}
