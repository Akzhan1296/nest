import { BlogItemDBType, BlogItemType, SearchTermBlogs } from '../blogs.type';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paginated } from '../../../../common/utils';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../../../common/common-types';
import { BlogViewModel } from '../../_models/view.models';
import { BlogsQueryStateRepository } from '../../_application/blogs.query.interface';

// asc сначала старые потом новые
// desc сначала новые потом старые

@Injectable()
export class BlogsQueryRepository implements BlogsQueryStateRepository {
  constructor(
    @InjectModel(BlogItemType.name)
    private readonly blogModel: Model<BlogItemType>,
  ) {}
  private async getBlogsCount(filter: SearchTermBlogs): Promise<number> {
    return await this.blogModel.find(filter).count();
  }
  private getBlogsViews(blogs: BlogItemDBType[]): BlogViewModel[] {
    return blogs.map((blog) => ({
      name: blog.name,
      websiteUrl: blog.websiteUrl,
      id: blog._id.toString(),
      createdAt: blog.createdAt,
      description: blog.description,
      isMembership: false,
    }));
  }
  async getBlogs(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    const { searchNameTerm, skip, pageSize, sortBy, sortDirection } =
      pageParams;

    const filter: SearchTermBlogs = { name: new RegExp(searchNameTerm, 'i') };

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
        websiteUrl: blog.websiteUrl,
        id: blog._id.toString(),
        createdAt: blog.createdAt,
        description: blog.description,
        isMembership: false,
      };
    }
    return null;
  }
}
