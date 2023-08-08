import {
  BannedUserBlogType,
  BlogItemDBType,
  BlogItemType,
  SearchTermBlogs,
} from '../blogs.type';
import { Model } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paginated } from '../../../../common/utils';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../../../common/common-types';
import {
  BannedUserForBlog,
  BlogSAViewModel,
  BlogViewModel,
} from '../../_models/view.models';
import { BlogsQueryStateRepository } from '../../_application/blogs.query.interface';
import { ObjectId } from 'mongodb';

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
  private getBlogsViewsSA(blogs: BlogItemDBType[]): BlogSAViewModel[] {
    return blogs.map((blog) => ({
      name: blog.name,
      websiteUrl: blog.websiteUrl,
      id: blog._id.toString(),
      createdAt: blog.createdAt,
      description: blog.description,
      isMembership: false,
      blogOwnerInfo: {
        userId: blog.ownerId.toString(),
        userLogin: blog.ownerLogin,
      },
      banInfo: {
        isBanned: blog.isBanned,
        banDate: blog.banDate,
      },
    }));
  }
  private getBannedBlogUsersViews(
    bannedUsers: BannedUserBlogType[],
  ): BannedUserForBlog[] {
    return bannedUsers.map((user) => ({
      id: user.userId,
      login: user.userLogin,
      banInfo: {
        isBanned: user.isBanned,
        banDate: user.banDate,
        banReason: user.banReason,
      },
    }));
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
        isBanned: blog.isBanned,
      };
    }
    return null;
  }
  async getBlogs(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    const { searchNameTerm, skip, pageSize, sortBy, sortDirection } =
      pageParams;

    const filter: SearchTermBlogs & { isBanned: boolean } = {
      name: new RegExp(searchNameTerm, 'i'),
      isBanned: false,
    };
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
  async getBlogsSA(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<BlogSAViewModel>> {
    const { searchNameTerm, skip, pageSize, sortBy, sortDirection } =
      pageParams;

    const filter: SearchTermBlogs = {
      name: new RegExp(searchNameTerm, 'i'),
    };

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
      this.getBlogsViewsSA(blogs),
    );
  }
  async getBloggerBlogs(
    pageParams: PageSizeQueryModel,
    ownerId: string,
  ): Promise<PaginationViewModel<BlogViewModel>> {
    const _ownerId = new ObjectId(ownerId);

    const { searchNameTerm, skip, pageSize, sortBy, sortDirection } =
      pageParams;

    const filter: SearchTermBlogs & { ownerId: ObjectId } = {
      name: new RegExp(searchNameTerm, 'i'),
      ownerId: _ownerId,
    };

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
  async getBloggerBannedUsers(
    pageParams: PageSizeQueryModel,
    blogId: string,
    ownerId: string,
  ): Promise<PaginationViewModel<BannedUserForBlog>> {
    // const _blogId = new ObjectId(blogId);

    const { searchNameTerm, skip, pageSize, sortBy, sortDirection } =
      pageParams;

    // const filter: SearchTermBlogs & { id: ObjectId } = {
    //   name: new RegExp(searchNameTerm, 'i'),
    //   id: _blogId,
    // };

    const blog = await this.blogModel
      .findById(blogId)
      .skip(skip)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .limit(pageSize);

    if (!blog) {
      throw new NotFoundException();
    }

    if (ownerId.toString() !== blog.ownerId.toString()) {
      throw new ForbiddenException();
    }

    return Paginated.transformPagination(
      {
        ...pageParams,
        // totalCount: await this.getBlogsCount(filter),
        totalCount: blog.bannedUsers ? blog.bannedUsers.length : 0,
      },
      this.getBannedBlogUsersViews(blog.bannedUsers ? blog.bannedUsers : []),
    );
  }

  async getBlogsAllComments(userId: string) {
    return await this.blogModel.find({ ownerId: new ObjectId(userId) });
  }
}
