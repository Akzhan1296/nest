import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UsersService } from '../../../users/application/users.service';
import { emailAdapter } from '../../../../common/adapter';
import { RegistrationUserDTO } from './../dto/auth.dto';
import { add } from 'date-fns';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RegistrationUserCommand {
  constructor(public createUser: RegistrationUserDTO) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    protected usersService: UsersService,
    protected usersRepository: UsersRepository,
  ) {}

  async execute(command: RegistrationUserCommand): Promise<void> {
    const isLoginAlreadyExist =
      await this.usersRepository.findUserByEmailOrLogin(
        command.createUser.login,
      );
    if (isLoginAlreadyExist) {
      throw new BadRequestException({
        message: 'login is already exist',
        field: 'login',
      });
    }

    const isEmailAlreadyExist =
      await this.usersRepository.findUserByEmailOrLogin(
        command.createUser.email,
      );
    if (isEmailAlreadyExist) {
      throw new BadRequestException({
        message: 'email is already exist',
        field: 'email',
      });
    }

    const confirmCode = new ObjectId().toString();
    let user = null;
    try {
      user = await this.usersService.createUser({
        ...command.createUser,
        confirmCode,
        isConfirmed: false,
        emailExpirationDate: add(new Date(), {
          minutes: 3,
        }),
      });
    } catch (err) {
      throw new Error(err);
    }

    if (user) {
      try {
        await emailAdapter.sendEmail(
          command.createUser.email,
          'Nest',
          `<a href="http://localhost:5005/?code=${confirmCode}">Confirm email</a>`,
        );
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}
