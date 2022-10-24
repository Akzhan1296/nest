import { Schema } from 'mongoose';
import { BlogItemType } from '../infrastructure/blogs.type';

export const BlogsSchema = new Schema<BlogItemType>(
  {
    name: String,
    youtubeUrl: String,
    createdAt: Date,
  },
  { versionKey: false },
);
