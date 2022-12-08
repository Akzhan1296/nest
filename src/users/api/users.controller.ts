import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/repository/users.query.repository';
import { AddUserInputModel, UsersQueryType } from './models/users.models';

@Controller('users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  async getUsers(@Query() pageSize: UsersQueryType) {
    return await this.usersQueryRepository.getUsers(pageSize);
  }
  @Post()
  @HttpCode(201)
  async createUser(@Body() inputModel: AddUserInputModel) {
    const user = await this.usersService.addUser(inputModel);
    return await this.usersQueryRepository.findUserById(user._id.toString());
  }
  @Delete(':id')
  async deleteUser(@Param() params: { id: string }) {
    return await this.usersService.deleteUser(params.id);
  }
}
