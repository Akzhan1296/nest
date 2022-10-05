import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import { PostItemType } from '../infrastructure/posts.type';

export const postsSchema = new Schema<PostItemType>(
  {
    title: String,
    shortDescription: String,
    content: String,
    blogId: ObjectId,
    blogName: String,
    createdAt: Date,
  },
  { versionKey: false },
);
