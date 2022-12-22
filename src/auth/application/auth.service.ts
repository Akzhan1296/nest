import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { UsersService } from '../../users/application/users.service';
import { emailAdapter } from '../../common/adapter';
import {
  AuthDTO,
  RegistrationConfirmationDTO,
  RegistrationUserDTO,
} from './dto/auth.dto';
import { add } from 'date-fns';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    protected usersService: UsersService,
    protected usersRepository: UsersRepository,
  ) {}

  private async checkCreds(creds: AuthDTO) {
    const foundUser = await this.usersRepository.findUserByEmailOrLogin(
      creds.loginOrEmail,
    );
    if (!foundUser) return null;
    const result = await bcrypt.compare(
      creds.password,
      foundUser.getPassword(),
    );
    if (result) {
      return foundUser;
    }
    return null;
  }

  async login(authDTO: AuthDTO) {
    const user = this.checkCreds(authDTO);
  }

  async registrationUser(createUser: RegistrationUserDTO) {
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
        // delete user
      }
    }
  }
  async registrationConfirmation(confirmCode: RegistrationConfirmationDTO) {
    const userByConfirmCode = await this.usersRepository.findUserByConfirmCode(
      confirmCode.code,
    );
    if (!userByConfirmCode)
      throw new NotFoundException('user by this confirm code not found');
    const code = userByConfirmCode.getConfirmCode();
    const confirmCodeExpDate = userByConfirmCode.getEmailExpirationDate();
    const isConfirmed = userByConfirmCode.getIsConfirmed();
    if (isConfirmed)
      throw new BadRequestException('Email is already confirmed');
    if (code === confirmCode.code && confirmCodeExpDate > new Date()) {
      userByConfirmCode.setIsConfirmed(true);
      return await this.usersRepository.save(userByConfirmCode);
    } else {
      throw new BadRequestException('date is already expired');
    }
  }
  async registrationEmailResending(email: string) {
    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (!userByEmail)
      throw new NotFoundException('user with this email not found');
    if (userByEmail.getIsConfirmed())
      throw new BadRequestException('Email is already confirmed');
    const newConfirmCode = new ObjectId().toString();

    userByEmail.setConfirmCode(newConfirmCode);

    userByEmail.setEmailExpirationDate(
      add(new Date(), {
        minutes: 3,
      }),
    );
    try {
      await emailAdapter.sendEmail(
        email,
        'Nest',
        `<a href="http://localhost:5005/?code=${newConfirmCode}">Confirm email</a>`,
      );
      this.usersRepository.save(userByEmail);
    } catch (err) {
      throw new Error(err);
    }
  }
}
