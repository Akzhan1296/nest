import { BlogItemDBType, BlogItemType } from '../blogs.type';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BlogsStateRepository } from 'src/blogs/application/blogs.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsRepository implements BlogsStateRepository {
  constructor(
    @InjectModel(BlogItemType.name)
    private blogModel: Model<BlogItemType>,
  ) {}
  async getBlogById(id: string): Promise<BlogItemDBType | null> {
    const blog = await this.blogModel.findOne({ _id: id });
    return blog;
  }
  async createBlog(newBlog: BlogItemType): Promise<BlogItemDBType> {
    const result = await this.blogModel.create(newBlog);
    return result;
  }
  async updateBlog(id: string, dto: BlogItemType): Promise<boolean> {
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
  async deleteBlog(id: string): Promise<boolean> {
    const blog = await this.blogModel.findOne({ _id: id });
    const isBlogDeleted: boolean = blog
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
