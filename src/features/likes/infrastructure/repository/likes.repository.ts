import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Like, LikeDocument } from '../../domain/likes.schema';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: Model<LikeDocument>,
  ) {}
  async findLikeByCommentId(
    commentId: string,
    userId: string,
  ): Promise<LikeDocument> {
    const _commentId = new ObjectId(commentId);
    const _userId = new ObjectId(userId);
    return await this.LikeModel.findOne({
      commentId: _commentId,
      userId: _userId,
    });
  }
  async save(like: LikeDocument): Promise<boolean> {
    return like
      .save()
      .then((savedDoc) => {
        return savedDoc === like;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  async delete(like: LikeDocument): Promise<boolean> {
    return like
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === like;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
}
