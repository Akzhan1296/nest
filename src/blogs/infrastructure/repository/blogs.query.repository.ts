import { BlogItemType } from '../blogs.type';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsQueryStateRepository } from 'src/blogs/application/blogs.query.interface';
import { BlogViewModel } from './models/view.models';

@Injectable()
export class BlogsQueryRepository implements BlogsQueryStateRepository {
  constructor(
    @InjectModel(BlogItemType.name)
    private blogModel: Model<BlogItemType>,
  ) {}
  async getBlogs(): Promise<BlogViewModel[]> {
    // return await BlogsModelClass.find(filter).skip(skip).limit(limit).lean();
    const blogs = await this.blogModel.find();
    return blogs.map((blog) => ({
      name: blog.name,
      youtubeUrl: blog.youtubeUrl,
      id: blog._id.toString(),
      createdAt: blog.createdAt,
    }));
  }
  async getBlogById(id: ObjectId): Promise<BlogViewModel | null> {
    const blog = await this.blogModel.findById(id);
    if (blog) {
      return {
        name: blog.name,
        youtubeUrl: blog.youtubeUrl,
        id: blog._id.toString(),
        createdAt: blog.createdAt,
      };
    }
    return null;
  }
}
