import { BlogItemType } from '../blogs.type';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsQueryStateRepository } from 'src/blogs/application/blogs.query.interface';
import { BlogViewModel } from './models/view.models';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from 'src/common/common-types';
import { Paginated } from 'src/common/utils';

@Injectable()
export class BlogsQueryRepository implements BlogsQueryStateRepository {
  constructor(
    @InjectModel(BlogItemType.name)
    private blogModel: Model<BlogItemType>,
  ) {}
  async getBlogsCount() {
    return await this.blogModel.count();
  }
  async getBlogs(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    const { skip, searchNameTerm, pageSize } = pageParams;
    const blogs = await this.blogModel
      .find(searchNameTerm)
      .skip(skip)
      .limit(pageSize);

    const paginated = new Paginated<BlogViewModel>(
      { ...pageParams, totalCount: await this.getBlogsCount() },
      blogs.map((blog) => ({
        name: blog.name,
        youtubeUrl: blog.youtubeUrl,
        id: blog._id.toString(),
        createdAt: blog.createdAt,
      })),
    ).transformPagination();
    return paginated;
  }
  async getBlogById(id: string): Promise<BlogViewModel | null> {
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
