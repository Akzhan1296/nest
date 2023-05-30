import { Injectable } from '@nestjs/common';
import { PostsStateRepository } from 'src/features/posts/application/posts.interface';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PostItemType } from '../posts.type';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDTO } from 'src/features/posts/application/dto/posts.dto';
import { Post, PostDocument } from '../../schema/posts.schema';

@Injectable()
export class PostsRepository implements PostsStateRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}
  async getPostById(id: string): Promise<PostDocument | null> {
    return await this.postModel.findOne({ _id: id });
  }
  async getPostByUserId(userId: ObjectId): Promise<PostDocument | null> {
    return await this.postModel.findOne({ userId });
  }
  async createPost(postItem: PostItemType): Promise<PostDocument> {
    const result = await this.postModel.create(postItem);
    return result;
  }
  async updatePost(id: string, postItem: CreatePostDTO): Promise<boolean> {
    const post = await this.postModel.findOne({ _id: id });

    post.title = postItem.title;
    post.content = postItem.content;
    post.shortDescription = postItem.shortDescription;
    const isPostUpdated = post
      .save()
      .then((savedDoc) => {
        return savedDoc === post;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    return isPostUpdated;
  }
  async deletePost(id: string): Promise<boolean> {
    const post = await this.postModel.findOne({ _id: id });
    const isPostDeleted = post
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === post;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    return isPostDeleted;
  }
  async incLike(postId: string) {
    return await this.postModel.updateOne(
      { _id: postId },
      {
        $inc: { likeCount: 1 },
      },
    );
  }
  async decLike(postId: string) {
    return await this.postModel.updateOne(
      { _id: postId },
      {
        $inc: { likeCount: -1 },
      },
    );
  }
  async incDislike(postId: string) {
    return await this.postModel.updateOne(
      { _id: postId },
      {
        $inc: { dislikeCount: 1 },
      },
    );
  }
  async decDislike(postId: string) {
    return await this.postModel.updateOne(
      { _id: postId },
      {
        $inc: { dislikeCount: -1 },
      },
    );
  }
}
