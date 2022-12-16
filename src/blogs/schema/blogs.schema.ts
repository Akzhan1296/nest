import { Schema } from 'mongoose';
import { BlogItemType } from '../infrastructure/blogs.type';

export const BlogsSchema = new Schema<BlogItemType>(
  {
    name: String,
    websiteUrl: String,
    createdAt: Date,
    description: String,
  },
  { versionKey: false },
);
