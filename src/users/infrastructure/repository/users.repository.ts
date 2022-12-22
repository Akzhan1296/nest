import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from 'src/users/domain/entity/users.schema';
import { Model } from 'mongoose';

export class UsersRepository {
  constructor(
    @InjectModel(Users.name)
    private UserModel: Model<UsersDocument>,
  ) {}
  async findUserById(id: string): Promise<UsersDocument> {
    return await this.UserModel.findOne({ _id: id });
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
  async save(user: UsersDocument): Promise<boolean> {
    return user
      .save()
      .then((savedDoc) => {
        return savedDoc === user;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  async delete(user: UsersDocument): Promise<boolean> {
    return user
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === user;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
}
