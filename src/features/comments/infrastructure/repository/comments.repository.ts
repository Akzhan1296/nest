import { HydratedDocument, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../../domain/entity/comments.schema';

class Repository<T> {
  async save(model: HydratedDocument<T>): Promise<boolean> {
    return model
      .save()
      .then((savedDoc) => {
        return savedDoc === model;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  async delete(model: HydratedDocument<T>): Promise<boolean> {
    return model
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === model;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
}

@Injectable()
export class CommentsRepository extends Repository<Comment> {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
  ) {
    super();
  }
  async findCommentById(id: string): Promise<CommentDocument> {
    return await this.CommentModel.findOne({ _id: id });
  }
  // async save(comment: CommentDocument): Promise<boolean> {
  //   return comment
  //     .save()
  //     .then((savedDoc) => {
  //       return savedDoc === comment;
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       return false;
  //     });
  // }
  // async delete(comment: CommentDocument): Promise<boolean> {
  //   return comment
  //     .delete()
  //     .then((deletedDoc) => {
  //       return deletedDoc === comment;
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       return false;
  //     });
  // }
  async incLike(commentId: string) {
    return await this.CommentModel.updateOne(
      { _id: commentId },
      {
        $inc: { likeCount: 1 },
      },
    );
  }
  async decLike(commentId: string) {
    return await this.CommentModel.updateOne(
      { _id: commentId },
      {
        $inc: { likeCount: -1 },
      },
    );
  }
  async incDislike(commentId: string) {
    return await this.CommentModel.updateOne(
      { _id: commentId },
      {
        $inc: { dislikeCount: 1 },
      },
    );
  }
  async decDislike(commentId: string) {
    return await this.CommentModel.updateOne(
      { _id: commentId },
      {
        $inc: { dislikeCount: -1 },
      },
    );
  }
}
