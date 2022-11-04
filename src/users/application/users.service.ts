import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}
  getUsers() {
    return this.usersRepository.getUsers();
  }
}
