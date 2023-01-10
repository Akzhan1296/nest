import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/entity/comments.schema';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/comments.dto';
import { CommentsRepository } from '../infrastructure/repository/comments.repository';
import { Model } from 'mongoose';
import { PostsRepository } from 'src/features/posts/infrastructure/repository/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
  ) {}

  // domain factory
  createComment(createCommentDTO: CreateCommentDTO): CommentDocument {
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

  async deleteComment(userId: string, id: string): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(id);
    if (!comment) throw new NotFoundException('comment not found');
    if (comment.userId.toString() !== userId)
      throw new ForbiddenException('not your comment');
    return this.commentsRepository.delete(comment);
  }
}
