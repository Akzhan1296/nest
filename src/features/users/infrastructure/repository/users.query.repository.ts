import { InjectModel } from '@nestjs/mongoose';
import {
  Users,
  UsersDocument,
} from 'src/features/users/domain/entity/users.schema';
import { Model } from 'mongoose';
import { MeViewModel, UserViewModel } from '../models/view.models';

import { Paginated } from '../../../../common/utils';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../../../common/common-types';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(Users.name)
    private UserModel: Model<UsersDocument>,
  ) {}

  private async getUsersCount(filter: any): Promise<number> {
    return await this.UserModel.find(filter).count();
  }

  private getUsersViews(users: UsersDocument[]): UserViewModel[] {
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
        createdAt: user.createdAt,
        login: user.getLogin(),
        email: user.getEmail(),
        id: user._id.toString(),
      };
    }
    return null;
  }
  async findMe(id: string): Promise<MeViewModel | null> {
    const user = await this.UserModel.findOne({ _id: id });
    if (user) {
      return {
        login: user.getLogin(),
        email: user.getEmail(),
        userId: user._id.toString(),
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
        { login: new RegExp(searchLoginTerm) },
        { email: new RegExp(searchEmailTerm) },
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
    return this.UserModel.deleteMany({});
  }
}
