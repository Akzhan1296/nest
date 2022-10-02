import { Schema } from 'mongoose';
import { BlogType } from '../infrastructure/blogs.type';

export const BlogsSchema = new Schema<BlogType>(
  {
    name: String,
    youtubeUrl: String,
  },
  { versionKey: false },
);
