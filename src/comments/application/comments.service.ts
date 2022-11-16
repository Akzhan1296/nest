import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/entity/comments.schema';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/comments.dto';
import { ObjectId } from 'mongodb';
import { CommentsRepository } from '../infrastructure/repository/comments.repository';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
    protected commentsRepository: CommentsRepository,
  ) {}
  // domain factory
  createComment(createCommentDTO: CreateCommentDTO) {
    const contentLength = createCommentDTO.content.length;
    if (contentLength < 3 || contentLength > 100) {
      throw new BadRequestException('length error');
    }

    const newCommentModel = new this.CommentModel(createCommentDTO);
    return newCommentModel;
  }

  async createCommentForSelectedPost(
    createCommentDTO: CreateCommentDTO,
  ): Promise<CommentDocument> {
    const newComment = this.createComment(createCommentDTO);
    await this.commentsRepository.save(newComment);
    return newComment;
  }

  async updateComment(
    id: ObjectId,
    updateCommentDTO: UpdateCommentDTO,
  ): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(id);
    try {
      comment.setContent(updateCommentDTO.content);
    } catch (err) {
      throw new BadRequestException(err);
    }

    const isCommentUpdated = this.commentsRepository.save(comment);
    return isCommentUpdated;
  }
  async deleteComment(id: ObjectId): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(id);
    if (!comment) throw new NotFoundException('not found');
    const isCommentDeleted = this.commentsRepository.delete(comment);
    return isCommentDeleted;
  }
}
