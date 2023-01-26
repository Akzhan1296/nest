import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UsersService } from '../../users/application/users.service';
import { emailAdapter } from '../../../common/adapter';
import {
  AuthDTO,
  GetRefreshTokenDTO,
  NewPasswordDTO,
  RegistrationConfirmationDTO,
  RegistrationUserDTO,
} from './dto/auth.dto';
import { add } from 'date-fns';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { AuthJwtService } from '../../jwt/application/jwt.service';
import { UsersDocument } from '../../users/domain/entity/users.schema';
import { JwtTokensRepository } from '../../jwt/infrastructura/repository/jwt.repository';
import { generateHash } from '../../../common/utils';

@Injectable()
export class AuthService {
  constructor(
    protected usersService: UsersService,
    protected usersRepository: UsersRepository,
    protected authJwtService: AuthJwtService,
    protected jwtTokensRepository: JwtTokensRepository,
  ) {}

  private async checkCreds(creds: AuthDTO): Promise<UsersDocument | null> {
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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { deviceName, deviceIp } = authDTO;
    const user = await this.checkCreds(authDTO);
    let refreshToken = null;
    if (!user) {
      throw new UnauthorizedException({ message: 'email or login incorrect' });
    }

    refreshToken = await this.jwtTokensRepository.getJwtByDeviceName(
      authDTO.deviceName,
      user._id,
    );
    if (refreshToken) {
      //update refresh token if user already logined
      return this.updateRefreshToken({
        userId: user._id.toString(),
        deviceId: refreshToken.getDeviceId(),
      });
    }
    const accessToken = await this.authJwtService.createAccessToken(user);
    refreshToken = await this.authJwtService.createRefreshToken({
      user,
      deviceName,
      deviceIp,
    });
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    getRefreshTokenDTO: GetRefreshTokenDTO,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.usersRepository.findUserById(
      getRefreshTokenDTO.userId,
    );

    if (user) {
      const accessToken = await this.authJwtService.createAccessToken(user);
      const refreshToken = await this.authJwtService.updateRefreshToken(
        getRefreshTokenDTO.deviceId,
      );
      return { accessToken, refreshToken };
    }
    throw new NotFoundException({ message: 'User not found' });
  }
  async registrationUser(createUser: RegistrationUserDTO): Promise<void> {
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
  async registrationConfirmation(
    confirmCode: RegistrationConfirmationDTO,
  ): Promise<boolean> {
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

  async registrationEmailResending(email: string): Promise<void> {
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

  async passwordRecovery(email: string): Promise<void> {
    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (!userByEmail) {
      // throw new BadRequestException({
      //   message: 'user with this email not found',
      //   field: 'email',
      // });
      return;
    }

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
        `<a href="http://localhost:5005/?recoveryCode=${newConfirmCode}">Recovery Code</a>`,
      );
      this.usersRepository.save(userByEmail);
    } catch (err) {
      throw new Error(err);
    }
  }

  async newPassword(newPasswordData: NewPasswordDTO): Promise<boolean> {
    const userByConfirmCode = await this.usersRepository.findUserByConfirmCode(
      newPasswordData.recoveryCode,
    );
    if (!userByConfirmCode)
      throw new NotFoundException('user by this confirm code not found');

    const code = userByConfirmCode.getConfirmCode();
    const confirmCodeExpDate = userByConfirmCode.getEmailExpirationDate();

    if (
      code === newPasswordData.recoveryCode &&
      confirmCodeExpDate > new Date()
    ) {
      const passwordHash = await generateHash(newPasswordData.newPassword);
      userByConfirmCode.setPassword(passwordHash);
      return await this.usersRepository.save(userByConfirmCode);
    } else {
      throw new BadRequestException('date is already expired');
    }
  }
}
