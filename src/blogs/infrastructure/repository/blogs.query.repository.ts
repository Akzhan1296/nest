import { BlogItemDBType, BlogType } from '../blogs.type';
import { ObjectId, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsQueryStateRepository } from 'src/blogs/application/blogs.query.interface';

@Injectable()
export class BlogsQueryRepository implements BlogsQueryStateRepository {
  constructor(
    @InjectModel(BlogType.name)
    private blogModel: Model<BlogType>,
  ) {}
  async getBlogs(): Promise<BlogItemDBType[]> {
    // return await BlogsModelClass.find(filter).skip(skip).limit(limit).lean();
    return await this.blogModel.find().lean();
  }
  async getBlogById(id: ObjectId): Promise<BlogItemDBType | null> {
    return await this.blogModel.findById(id);
  }
}
