import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../../domain/entity/comments.schema';
import { Repository } from '../../../../common/common-repository-types';
@Injectable()
export class CommentsRepository extends Repository<Comment> {
  constructor(
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,
  ) {
    super();
  }
  async findCommentById(id: string): Promise<CommentDocument> {
    return await this.CommentModel.findOne({ _id: id });
  }

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
