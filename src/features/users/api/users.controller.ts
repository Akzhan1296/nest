import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationViewModel } from '../../../common/common-types';
import { AuthBasicGuard } from '../../../guards/authBasic.guard';
import { UsersService } from '../application/users.service';
import { UserViewModel } from '../infrastructure/models/view.models';
import { UsersQueryRepository } from '../infrastructure/repository/users.query.repository';
import { AddUserInputModel, UsersQueryType } from './models/users.models';

@Controller('users')
@UseGuards(AuthBasicGuard)
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(
    @Query() pageSize: UsersQueryType,
  ): Promise<PaginationViewModel<UserViewModel>> {
    return await this.usersQueryRepository.getUsers(pageSize);
  }

  @Post()
  @HttpCode(201)
  async createUser(
    @Body() inputModel: AddUserInputModel,
  ): Promise<UserViewModel> {
    const user = await this.usersService.createUser({
      ...inputModel,
      isConfirmed: false,
      emailExpirationDate: null,
      confirmCode: null,
    });
    return await this.usersQueryRepository.findUserById(user._id.toString());
  }

  @Delete(':id')
  async deleteUser(@Param() params: { id: string }): Promise<boolean> {
    return await this.usersService.deleteUser(params.id);
  }
}
