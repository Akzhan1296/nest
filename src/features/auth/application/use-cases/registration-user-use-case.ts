import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { RegistrationUserDTO } from './../dto/auth.dto';
import { add } from 'date-fns';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { CreateUserCommand } from '../../../users/application/use-cases/create-user-use-case';

export class RegistrationUserCommand {
  constructor(public createUser: RegistrationUserDTO) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
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
      user = await this.commandBus.execute(
        new CreateUserCommand({
          ...command.createUser,
          confirmCode,
          isConfirmed: false,
          emailExpirationDate: add(new Date(), {
            minutes: 3,
          }),
        }),
      );
    } catch (err) {
      throw new Error(err);
    }

    if (user) {
      try {
        await this.authService.sendEmail({
          email: command.createUser.email,
          code: confirmCode,
          letterTitle: 'Registration',
          letterText: 'Confirm code',
        });
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}
