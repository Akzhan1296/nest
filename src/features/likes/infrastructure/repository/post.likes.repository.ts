import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { PostLike, PostLikeDocument } from '../../domain/posts.likes.schema';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectModel(PostLike.name)
    private PostLikeModel: Model<PostLikeDocument>,
  ) {}
  async findLikeByPostId(
    postId: string,
    userId: string,
  ): Promise<PostLikeDocument> {
    const _postId = new ObjectId(postId);
    const _userId = new ObjectId(userId);
    return await this.PostLikeModel.findOne({
      postId: _postId,
      userId: _userId,
    });
  }
  async save(like: PostLikeDocument): Promise<boolean> {
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
  async delete(like: PostLikeDocument): Promise<boolean> {
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
  async dropPostLikes() {
    return this.PostLikeModel.deleteMany({});
  }
}
