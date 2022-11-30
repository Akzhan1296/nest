import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
} from 'src/comments/domain/entity/comments.schema';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
  ) {}
  async findCommentById(id: string): Promise<CommentDocument> {
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
  async delete(comment: CommentDocument): Promise<boolean> {
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
