import { BlogItemDBType, BlogItemType, SearchTermBlogs } from '../blogs.type';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsQueryStateRepository } from 'src/blogs/application/blogs.query.interface';
import { BlogViewModel } from './models/view.models';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from 'src/common/common-types';
import { Paginated } from '../../../common/utils';

// asc сначала старые потом новые
// desc сначала новые потом старые

@Injectable()
export class BlogsQueryRepository implements BlogsQueryStateRepository {
  constructor(
    @InjectModel(BlogItemType.name)
    private blogModel: Model<BlogItemType>,
  ) {}
  private async getBlogsCount(filter: SearchTermBlogs) {
    return await this.blogModel.find(filter).count();
  }
  private getBlogsViews(blogs: BlogItemDBType[]) {
    return blogs.map((blog) => ({
      name: blog.name,
      youtubeUrl: blog.youtubeUrl,
      id: blog._id.toString(),
      createdAt: blog.createdAt,
    }));
  }
  async getBlogs(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    const { searchNameTerm, skip, pageSize, sortBy, sortDirection } =
      pageParams;

    const filter: SearchTermBlogs = { name: new RegExp(searchNameTerm) };

    const blogs = await this.blogModel
      .find(filter)
      .skip(skip)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .limit(pageSize);

    return Paginated.transformPagination(
      {
        ...pageParams,
        totalCount: await this.getBlogsCount(filter),
      },
      this.getBlogsViews(blogs),
    );
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
  async dropBlogs() {
    return this.blogModel.collection.drop();
  }
}
