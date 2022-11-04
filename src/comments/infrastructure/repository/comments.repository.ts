import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
} from 'src/comments/domain/entity/comments.schema';
import { CreateCommentDTO } from 'src/comments/application/dto/comments.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
  ) {}
  createComment(createCommentDTO: CreateCommentDTO) {
    return new this.CommentModel(createCommentDTO);
  }
  async findCommentById(id: ObjectId): Promise<CommentDocument> {
    return await this.CommentModel.findOne({ _id: id });
  }
  async save(comment: CommentDocument): Promise<boolean> {
    return comment
      .save()
      .then((savedDoc) => {
        return savedDoc === comment;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  async deleteComment(comment: CommentDocument): Promise<boolean> {
    return comment
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === comment;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
}
