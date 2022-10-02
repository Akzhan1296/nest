import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

export class PostInputModel {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: ObjectId,
  ) {}
}

export class PostItemDBType {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: ObjectId,
    public blogName: string,
    public _id: ObjectId,
  ) {}
}

export const postsSchema = new Schema<PostItemDBType>(
  {
    title: String,
    shortDescription: String,
    content: String,
    blogId: ObjectId,
    blogName: String,
  },
  { versionKey: false },
);

export const PostsModelClass = model('posts', postsSchema);
