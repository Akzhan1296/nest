import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/entity/comments.schema';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/comments.dto';
import { ObjectId } from 'mongodb';
import { CommentsRepository } from '../infrastructure/repository/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    protected commentsRepository: CommentsRepository,
  ) {}
  async createCommentForSelectedPost(
    createCommentDTO: CreateCommentDTO,
  ): Promise<Comment> {
    const newComment = this.commentsRepository.createComment(createCommentDTO);
    await this.commentsRepository.save(newComment);
    return newComment;
  }
  async updateComment(
    id: ObjectId,
    updateCommentDTO: UpdateCommentDTO,
  ): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(id);
    comment.content = updateCommentDTO.content;
    const isCommentUpdated = this.commentsRepository.save(comment);
    return isCommentUpdated;
  }
  async deleteComment(id: ObjectId): Promise<boolean> {
    const comment = await this.commentsRepository.findCommentById(id);
    const isCommentDeleted = this.commentsRepository.deleteComment(comment);
    return isCommentDeleted;
  }
}

//TODO add controllers to comments