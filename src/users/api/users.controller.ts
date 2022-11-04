import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../application/users.service';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
  @Post()
  createUser(@Body() inputModel: CreateUserType) {
    return {
      login: inputModel.login,
    };
  }
  @Delete(':id')
  deleteUser(@Param() params: { id: string }) {
    return {
      userId: params.id,
    };
  }
}

type CreateUserType = {
  login: string;
  password: string;
};
