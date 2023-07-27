import { Schema } from 'mongoose';
import { BlogItemType } from '../_infrastructure/blogs.type';
import { ObjectId } from 'mongodb';

export const BlogsSchema = new Schema<BlogItemType>(
  {
    name: String,
    websiteUrl: String,
    createdAt: Date,
    description: String,
    ownerId: ObjectId,
    ownerLogin: String,
    isBanned: Boolean,
    banDate: Date,
  },
  { versionKey: false },
);
