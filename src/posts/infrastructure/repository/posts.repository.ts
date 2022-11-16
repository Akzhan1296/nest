import { Injectable } from '@nestjs/common';
import { PostsStateRepository } from 'src/posts/application/posts.interface';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PostItemDBType, PostItemType } from '../posts.type';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDTO } from 'src/posts/application/dto/posts.dto';

@Injectable()
export class PostsRepository implements PostsStateRepository {
  constructor(
    @InjectModel(PostItemType.name)
    private postModel: Model<PostItemType>,
  ) {}
  async createPost(postItem: PostItemType): Promise<PostItemDBType> {
    const result = await this.postModel.create(postItem);
    return result;
  }
  async updatePost(id: string, postItem: CreatePostDTO): Promise<boolean> {
    const post = await this.postModel.findOne({ _id: id });

    post.title = postItem.title;
    post.content = postItem.content;
    post.shortDescription = postItem.shortDescription;
    post.blogId = new ObjectId(postItem.blogId);
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
}
