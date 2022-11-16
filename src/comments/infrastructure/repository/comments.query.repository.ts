import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
} from 'src/comments/domain/entity/comments.schema';
import { CommentViewModel } from '../models/view.models';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
  ) {}
  async getComments(): Promise<CommentViewModel[]> {
    const comments = await this.CommentModel.find();

    return comments.map((comment) => ({
      id: comment._id.toString(),
      content: comment.getContent(),
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    }));
  }
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const comment = await this.CommentModel.findById({ _id: id });
    if (comment) {
      return {
        id: comment._id.toString(),
        content: comment.getContent(),
        userId: comment.userId.toString(),
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
      };
    }
    return null;
  }
  async getCommentsByPostId(postId: string) {
    const comments = await this.CommentModel.find({ postId });

    return comments.map((comment) => ({
      id: comment._id.toString(),
      content: comment.getContent(),
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    }));
  }
}
