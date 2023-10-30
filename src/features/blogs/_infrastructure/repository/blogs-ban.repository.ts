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

export class BanBlogsRepository extends Repository<BanBlog> {
  constructor(
    @InjectModel(BanBlog.name)
    private readonly banBlogModel: Model<BanBlogsDocument>,
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
  ): Promise<PaginationViewModel<BannedUserForBlog>> {
    const { skip, pageSize, sortBy, sortDirection } = pageParams;

    const bannedUsersCount = await this.banBlogModel.find().count();

    console.log(pageParams);

    const bannedUsers = await this.banBlogModel
      .find({ blogId })
      .skip(skip)
      .sort({
        [sortBy === 'login' ? 'userLogin' : sortBy]:
          sortDirection === 'asc' ? 1 : -1,
      })
      .limit(pageSize);

    return Paginated.transformPagination(
      {
        ...pageParams,
        totalCount: bannedUsersCount,
      },
      this.getBannedBlogUsersViews(bannedUsers),
    );
  }
}
