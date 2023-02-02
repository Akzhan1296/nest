import { Injectable, NotFoundException } from '@nestjs/common';
import { Users } from '../../domain/entity/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../../infrastructure/repository/users.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @InjectModel(Users.name)
    protected usersRepository: UsersRepository,
  ) {}

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.usersRepository.findUserById(id);
    if (!user) throw new NotFoundException('user not found');
    return this.usersRepository.delete(user);
  }
}
