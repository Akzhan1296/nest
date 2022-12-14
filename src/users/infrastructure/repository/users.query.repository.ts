import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from 'src/users/domain/entity/users.schema';
import { Model } from 'mongoose';
import { UserViewModel } from '../models/view.models';

import { Paginated } from '../../../common/utils';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../../common/common-types';

export class UsersQueryRepository {
  constructor(
    @InjectModel(Users.name)
    private UserModel: Model<UsersDocument>,
  ) {}

  private async getUsersCount(filter: any) {
    return await this.UserModel.find(filter).count();
  }

  private getUsersViews(users: UsersDocument[]) {
    return users.map((user) => ({
      login: user.getLogin(),
      createdAt: user.createdAt,
      email: user.getEmail(),
      id: user._id.toString(),
    }));
  }

  async findUserById(id: string): Promise<UserViewModel | null> {
    const user = await this.UserModel.findOne({ _id: id });
    if (user) {
      return {
        login: user.getLogin(),
        createdAt: user.createdAt,
        email: user.getEmail(),
        id: user._id.toString(),
      };
    }
    return null;
  }
  async getUsers(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<UserViewModel>> {
    const {
      searchEmailTerm,
      searchLoginTerm,
      skip,
      pageSize,
      sortBy,
      sortDirection,
    } = pageParams;

    const filter = {
      $or: [
        { email: new RegExp(searchEmailTerm) },
        { login: new RegExp(searchLoginTerm) },
      ],
    };

    const users = await this.UserModel.find(filter)
      .skip(skip)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .limit(pageSize);

    return Paginated.transformPagination<UserViewModel>(
      {
        ...pageParams,
        totalCount: await this.getUsersCount(filter),
      },
      this.getUsersViews(users),
    );
  }

  async dropUsers() {
    return this.UserModel.collection.drop();
  }
}
