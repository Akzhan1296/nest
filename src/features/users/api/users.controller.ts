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
import { CommandBus } from '@nestjs/cqrs';
// guards
import { AuthBasicGuard } from '../../../guards/authBasic.guard';
// commands
import { CreateUserCommand } from '../application/use-cases/create-user-use-case';
import { DeleteUserCommand } from '../application/use-cases/delete-user-use-case';
// models
import { PaginationViewModel } from '../../../common/common-types';
import { UserViewModel } from '../infrastructure/models/view.models';
import { AddUserInputModel, UsersQueryType } from './models/users.models';
// repo
import { UsersQueryRepository } from '../infrastructure/repository/users.query.repository';

@Controller('users')
//@UseGuards(AuthBasicGuard)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
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
    const user = await this.commandBus.execute(
      new CreateUserCommand({
        ...inputModel,
        isConfirmed: false,
        emailExpirationDate: null,
        confirmCode: null,
      }),
    );
    return await this.usersQueryRepository.findUserById(user._id.toString());
  }

  @Delete(':id')
  async deleteUser(@Param() params: { id: string }): Promise<boolean> {
    return await this.commandBus.execute(new DeleteUserCommand(params.id));
  }
}
