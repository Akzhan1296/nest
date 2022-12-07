import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from 'src/users/domain/entity/users.schema';
import { Model } from 'mongoose';
import { UserViewModel } from '../models/view.models';

export class UsersQueryRepository {
  constructor(
    @InjectModel(Users.name)
    private UserModel: Model<UsersDocument>,
  ) {}
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
  async getUsers(params: any): Promise<UserViewModel[]> {
    params.searchLoginTerm;
    params.searchEmailTerm;

    // {
    //   email: 'dsaads@dca',
    //   login: 'adsasd',
    // }

    // const users = await this.UserModel.find();
    // if (user) {
    //   return {
    //     login: user.getLogin(),
    //     createdAt: user.createdAt,
    //     email: user.getEmail(),
    //     id: user._id.toString(),
    //   };
    // }
    // return users;
    return [];
  }
}
