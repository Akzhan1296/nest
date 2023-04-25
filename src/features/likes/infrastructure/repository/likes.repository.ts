import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Like, LikeDocument } from '../../domain/likes.schema';
import { Repository } from '../../../../common/common-repository-types';

@Injectable()
export class LikesRepository extends Repository<LikeDocument> {
  constructor(
    @InjectModel(Like.name)
    private readonly LikeModel: Model<LikeDocument>,
  ) {
    super();
  }
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
}
