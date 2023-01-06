import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UsersService } from '../../users/application/users.service';
import { emailAdapter } from '../../common/adapter';
import {
  AuthDTO,
  GetRefreshTokenDTO,
  RegistrationConfirmationDTO,
  RegistrationUserDTO,
} from './dto/auth.dto';
import { add } from 'date-fns';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { AuthJwtService } from '../../jwt/application/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    protected usersService: UsersService,
    protected usersRepository: UsersRepository,
    protected authJwtService: AuthJwtService,
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

  async login(
    authDTO: AuthDTO,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.checkCreds(authDTO);
    if (user) {
      const accessToken = await this.authJwtService.createAccessToken(user);
      const refreshToken = await this.authJwtService.createRefreshToken(user);
      return { accessToken, refreshToken };
    }
    throw new UnauthorizedException({ message: 'email or login incorrect' });
  }
  async refreshToken(
    getRefreshTokenDTO: GetRefreshTokenDTO,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.usersRepository.findUserById(
      getRefreshTokenDTO.userId,
    );
    const isRefreshTokenAddedToBlackList =
      this.authJwtService.addRefreshTokenToBlacklist(
        getRefreshTokenDTO.refreshTokenId,
      );
    if (user && isRefreshTokenAddedToBlackList) {
      const accessToken = await this.authJwtService.createAccessToken(user);
      const refreshToken = await this.authJwtService.createRefreshToken(user);
      return { accessToken, refreshToken };
    }
    throw new NotFoundException({ message: 'User not found' });
  }
  async registrationUser(createUser: RegistrationUserDTO) {
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
      throw new BadRequestException({
        message: 'Email is already confirmed',
        field: 'code',
      });
    if (code === confirmCode.code && confirmCodeExpDate > new Date()) {
      userByConfirmCode.setIsConfirmed(true);
      return await this.usersRepository.save(userByConfirmCode);
    } else {
      throw new BadRequestException('date is already expired');
    }
  }
  async registrationEmailResending(email: string) {
    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (!userByEmail) {
      throw new BadRequestException({
        message: 'user with this email not found',
        field: 'email',
      });
    }

    if (userByEmail.getIsConfirmed())
      throw new BadRequestException({
        message: 'Email is already confirmed',
        field: 'email',
      });
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
