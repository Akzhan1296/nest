import { BlogItemDBType, BlogType } from '../blogs.type';
import { ObjectId, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BlogsStateRepository } from 'src/blogs/application/blogs.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsRepository implements BlogsStateRepository {
  constructor(
    @InjectModel(BlogType.name)
    private blogModel: Model<BlogType>,
  ) {}
  async createBlog(newBlog: BlogType): Promise<BlogItemDBType> {
    const result = await this.blogModel.insertMany(newBlog);
    return { ...newBlog, id: result[0]['_id'] };
  }
  async updateBlog(id: ObjectId, dto: BlogType): Promise<boolean> {
    const blog = await this.blogModel.findOne({ _id: id });
    blog.name = dto.name;
    blog.youtubeUrl = dto.youtubeUrl;
    const isBlogUpdated = blog
      .save()
      .then((savedDoc) => {
        return savedDoc === blog;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    return isBlogUpdated;
  }
  async deleteBlog(id: ObjectId): Promise<boolean> {
    const blog = await this.blogModel.findOne({ _id: id });
    const isBlogDeleted = blog
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === blog;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    return isBlogDeleted;
  }
}
