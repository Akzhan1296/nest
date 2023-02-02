import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from './../dto/auth.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { AuthJwtService } from '../../../jwt/application/jwt.service';
import { UsersDocument } from '../../../users/domain/entity/users.schema';
import { JwtTokensRepository } from '../../../jwt/infrastructura/repository/jwt.repository';
import { UpdateRefreshTokenUseCase } from './update-refresh-token-use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    protected usersRepository: UsersRepository,
    protected authJwtService: AuthJwtService,
    protected jwtTokensRepository: JwtTokensRepository,
    protected updateRefreshTokenuseCase: UpdateRefreshTokenUseCase,
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

  async execute(
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
      return this.updateRefreshTokenuseCase.execute({
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
}
