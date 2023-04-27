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
    commentId: ObjectId,
    userId: ObjectId,
  ): Promise<LikeDocument> {
    return await this.LikeModel.findOne({
      commentId,
      userId,
    });
  }
}
