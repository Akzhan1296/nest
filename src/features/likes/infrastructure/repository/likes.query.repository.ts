import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Like, LikeDocument } from '../../domain/likes.schema';
import { LikeModelView } from '../models/view.models';

@Injectable()
export class LikesQueryRepository {
  constructor(
    @InjectModel(Like.name)
    private readonly LikeModel: Model<LikeDocument>,
  ) {}

  async getLikeById(
    commentId: string,
    userId: ObjectId,
  ): Promise<LikeModelView | null> {
    const _commentId = new ObjectId(commentId);
    const like = await this.LikeModel.findOne({
      commentId: _commentId,
      userId,
    });

    return {
      myStatus: like ? like.getLikeStatus() : 'None',
    };
  }

  async getLikesByPostId(
    postId: string,
    userId: ObjectId,
  ): Promise<LikeDocument[]> {
    // const _postId = new ObjectId(postId);
    const likes = await this.LikeModel.find({
      postId,
      userId,
    });

    return likes;
  }

  async dropLikes() {
    return this.LikeModel.deleteMany({});
  }
}
