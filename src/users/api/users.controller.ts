import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserInputModelType } from './models/users.models';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  // getUsers(){

  // }
  @Post()
  createUser(@Body() inputModel: CreateUserInputModelType) {
    return this.usersService.createUser(inputModel);
  }
  @Delete(':id')
  deleteUser(@Param() params: { id: string }) {
    return {
      userId: params.id,
    };
  }
}
