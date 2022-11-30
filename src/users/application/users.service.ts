import {
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Users, UsersDocument } from '../domain/entity/users.schema';
import { CreateUserDTO } from './dto/users.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../infrastructure/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private UsersModel: Model<UsersDocument>,
    protected usersRepository: UsersRepository,
  ) {}
  async newUser(createUserDTO: CreateUserDTO) {
    const newUser = new this.UsersModel();
    const { login, password, email } = createUserDTO;
    try {
      newUser.createUser(login, email, password);
    } catch (err) {
      throw new ImATeapotException(err);
    }

    return newUser;
  }
  async createUser(createUserDTO: CreateUserDTO) {
    const newUser = await this.newUser(createUserDTO);
    await this.usersRepository.save(newUser);
    return newUser;
  }
  async deleteUser(id: string) {
    const user = await this.usersRepository.findUserById(id);
    if (!user) throw new NotFoundException('user not found');
    return this.usersRepository.delete(user);
  }
}
