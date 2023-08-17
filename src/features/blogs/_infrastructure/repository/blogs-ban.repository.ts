import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../../../common/common-repository-types';
import { Model } from 'mongoose';
import { BanBlog, BanBlogsDocument } from '../../domain/ban-blogs.schema';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../../../common/common-types';
import { Paginated } from '../../../../common/utils';
import { BannedUserForBlog } from '../../_models/view.models';
import { ForbiddenException } from '@nestjs/common';
import { BlogItemType } from '../blogs.type';

export class BanBlogsRepository extends Repository<BanBlog> {
  constructor(
    @InjectModel(BanBlog.name)
    private readonly banBlogModel: Model<BanBlogsDocument>,
    @InjectModel(BlogItemType.name)
    private readonly blogModel: Model<BlogItemType>,
  ) {
    super();
  }

  private getBannedBlogUsersViews(users: BanBlog[]): BannedUserForBlog[] {
    return users.map((user) => {
      return {
        id: user.userId,
        login: user.userLogin,
        banInfo: {
          isBanned: user.isBanned,
          banDate: user.banDate,
          banReason: user.banReason,
        },
      };
    });
  }

  async findBanBlogByIds(
    blogId: string,
    userId: string,
  ): Promise<BanBlogsDocument> {
    return await this.banBlogModel.findOne({ blogId, userId });
  }

  async getBloggerBannedUsers(
    pageParams: PageSizeQueryModel,
    blogId: string,
    userId: string, // from token
  ): Promise<PaginationViewModel<BannedUserForBlog>> {
    const { skip, pageSize, sortBy, sortDirection } = pageParams;

    const bannedUsers = await this.banBlogModel
      .find({ blogId })
      .skip(skip)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .limit(pageSize);

    const blog = await this.blogModel.findOne({ _id: blogId });

    if (blog && blog.ownerId.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }

    return Paginated.transformPagination(
      {
        ...pageParams,
        totalCount: bannedUsers.length,
      },
      this.getBannedBlogUsersViews(bannedUsers),
    );
  }
}
