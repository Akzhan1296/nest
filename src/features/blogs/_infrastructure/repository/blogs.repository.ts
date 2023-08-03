import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsStateRepository } from '../../_application/blogs.interface';
import { BlogItemDBType, BlogItemType } from '../blogs.type';
import { BlogUpdateType } from '../../_application/dto/blogs.dto';

@Injectable()
export class BlogsRepository implements BlogsStateRepository {
  constructor(
    @InjectModel(BlogItemType.name)
    private readonly blogModel: Model<BlogItemType>,
  ) {}
  async getBlogById(id: string) {
    const blog = await this.blogModel.findOne({ _id: id });
    return blog;
  }
  async createBlog(newBlog: BlogItemType): Promise<BlogItemDBType> {
    return await this.blogModel.create({
      name: newBlog.name,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      description: newBlog.description,
      ownerId: newBlog.ownerId,
      ownerLogin: newBlog.ownerLogin,
      isBanned: newBlog.isBanned,
    });
  }
  async updateBlog(id: string, dto: BlogUpdateType): Promise<boolean> {
    const blog = await this.blogModel.findOne({ _id: id });
    blog.name = dto.name;
    blog.websiteUrl = dto.websiteUrl;
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
  async banBlog(id: string, banStatus: boolean): Promise<boolean> {
    const blog = await this.blogModel.findOne({ _id: id });
    if (!blog) return false;
    blog.isBanned = banStatus;
    banStatus ? (blog.banDate = new Date()) : (blog.banDate = null);
    const isBlogBanned = blog
      .save()
      .then((savedDoc) => {
        return savedDoc === blog;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    return isBlogBanned;
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
