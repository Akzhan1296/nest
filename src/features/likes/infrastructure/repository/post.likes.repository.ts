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
  // async findLikeByPostId(
  //   postId: string,
  //   userId: string,
  // ): Promise<PostLikeDocument> {
  //   const _postId = new ObjectId(postId);
  //   const _userId = new ObjectId(userId);
  //   return await this.PostLikeModel.findOne({
  //     postId: _postId,
  //     userId: _userId,
  //   });
  // }
  async findPostLikesByUserId(userId: ObjectId): Promise<PostLikeDocument[]> {
    return await this.PostLikeModel.find({
      userId,
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
