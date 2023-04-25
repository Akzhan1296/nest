import { InjectModel } from '@nestjs/mongoose';
import {
  Users,
  UsersDocument,
} from 'src/features/users/domain/entity/users.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { Repository } from '../../../../common/common-repository-types';
@Injectable()
export class UsersRepository extends Repository<UsersDocument> {
  constructor(
    @InjectModel(Users.name)
    private UserModel: Model<UsersDocument>,
  ) {
    super();
  }
  async findUserById(id: string): Promise<UsersDocument> {
    const idObject = new ObjectId(id);
    return await this.UserModel.findOne({ _id: idObject });
  }
  async findUserByConfirmCode(confirmCode: string): Promise<UsersDocument> {
    return await this.UserModel.findOne({ confirmCode });
  }
  async findUserByEmail(email: string): Promise<UsersDocument> {
    return await this.UserModel.findOne({ email });
  }
  async findUserByEmailOrLogin(emailOrLogin: string): Promise<UsersDocument> {
    return await this.UserModel.findOne({
      $or: [{ email: emailOrLogin }, { login: emailOrLogin }],
    });
  }
}
