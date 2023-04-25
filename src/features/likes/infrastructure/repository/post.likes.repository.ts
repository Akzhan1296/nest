import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { PostLike, PostLikeDocument } from '../../domain/posts.likes.schema';
import { Repository } from '../../../../common/common-repository-types';

@Injectable()
export class PostLikesRepository extends Repository<PostLikeDocument> {
  constructor(
    @InjectModel(PostLike.name)
    private readonly PostLikeModel: Model<PostLikeDocument>,
  ) {
    super();
  }
  async findLikeByUserAndPostId(
    postId: string,
    userId: ObjectId,
  ): Promise<PostLikeDocument> {
    const _postId = new ObjectId(postId);

    return await this.PostLikeModel.findOne({
      postId: _postId,
      userId,
    });
  }
  async findPostLikesByUserId(userId: ObjectId): Promise<PostLikeDocument[]> {
    return await this.PostLikeModel.find({
      userId,
    });
  }
  async dropPostLikes() {
    return this.PostLikeModel.deleteMany({});
  }
}
