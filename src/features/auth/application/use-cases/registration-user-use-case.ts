import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UsersService } from '../../../users/application/users.service';
import { emailAdapter } from '../../../../common/adapter';
import { RegistrationUserDTO } from './../dto/auth.dto';
import { add } from 'date-fns';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';

@Injectable()
export class RegistrationUserUseCaseRegistrationUserUseCase {
  constructor(
    protected usersService: UsersService,
    protected usersRepository: UsersRepository,
  ) {}

  async execute(createUser: RegistrationUserDTO): Promise<void> {
    const isLoginAlreadyExist =
      await this.usersRepository.findUserByEmailOrLogin(createUser.login);
    if (isLoginAlreadyExist) {
      throw new BadRequestException({
        message: 'login is already exist',
        field: 'login',
      });
    }

    const isEmailAlreadyExist =
      await this.usersRepository.findUserByEmailOrLogin(createUser.email);
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
        ...createUser,
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
          createUser.email,
          'Nest',
          `<a href="http://localhost:5005/?code=${confirmCode}">Confirm email</a>`,
        );
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}
