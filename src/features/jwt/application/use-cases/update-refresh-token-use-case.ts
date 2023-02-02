import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { settings } from '../../../../settings';
import { JwtTokens } from '../../domain/jwt.schema';
import { JwtTokensRepository } from '../../infrastructura/repository/jwt.repository';

@Injectable()
export class UpdateRefreshTokenUseCase {
  constructor(
    @InjectModel(JwtTokens.name)
    protected jwtService: JwtService,
    protected jwtTokensRepository: JwtTokensRepository,
  ) {}

  async updateRefreshToken(deviceId: string): Promise<string | null> {
    let updatedRefreshToken = null;

    const refreshTokenMetaData =
      await this.jwtTokensRepository.getJwtByDeviceId(deviceId);

    refreshTokenMetaData.setCreatedAt(new Date());
    const isTokenSaved = await this.jwtTokensRepository.save(
      refreshTokenMetaData,
    );

    const payload = {
      login: refreshTokenMetaData.getLogin(),
      email: refreshTokenMetaData.getEmail(),
      userId: refreshTokenMetaData.getUserId(),
      createdAt: refreshTokenMetaData.getCreatedAt(),
      deviceId: refreshTokenMetaData.getDeviceId(),
      deviceIp: refreshTokenMetaData.getDeviceIp(),
      deviceName: refreshTokenMetaData.getDeviceName(),
    };

    if (isTokenSaved) {
      updatedRefreshToken = this.jwtService.sign(payload, {
        secret: settings.JWT_SECRET,
        expiresIn: '20sec',
      });
    } else {
      throw new BadGatewayException('token not saved');
    }
    return updatedRefreshToken;
  }
}
