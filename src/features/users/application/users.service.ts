import { Injectable, NotFoundException } from '@nestjs/common';
import { Users, UsersDocument } from '../domain/entity/users.schema';
import { CreateUserDTO } from './dto/users.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../infrastructure/repository/users.repository';
import { generateHash } from '../../../common/utils';

// TO-DO ask about using use-case inside different use-case
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private UsersModel: Model<UsersDocument>,
    protected usersRepository: UsersRepository,
  ) {}

  private async _createUser(
    createUserDTO: CreateUserDTO,
  ): Promise<UsersDocument> {
    const newUser = new this.UsersModel();
    try {
      newUser.createUser(createUserDTO);
    } catch (err) {
      throw new Error(err);
    }

    return newUser;
  }
  async createUser(createUserDTO: CreateUserDTO): Promise<UsersDocument> {
    const { password, ...restCreateUserData } = createUserDTO;
    const passwordHash = await generateHash(password);
    const newUser = await this._createUser({
      ...restCreateUserData,
      password: passwordHash,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.usersRepository.findUserById(id);
    if (!user) throw new NotFoundException('user not found');
    return this.usersRepository.delete(user);
  }
}
