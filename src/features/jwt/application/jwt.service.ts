import { UsersDocument } from '../../users/domain/entity/users.schema';
import { JwtService } from '@nestjs/jwt';
import { settings } from '../../../settings';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { JwtTokens, JwtTokensDocument } from '../domain/jwt.schema';
import { Model } from 'mongoose';
import { JwtTokensRepository } from '../infrastructura/repository/jwt.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRefreshTokenDTO } from './dto/jwt.dto';

@Injectable()
export class AuthJwtService {
  constructor(
    @InjectModel(JwtTokens.name)
    private JwtTokenModel: Model<JwtTokensDocument>,
    protected jwtService: JwtService,
    protected jwtTokensRepository: JwtTokensRepository,
  ) {}
  async createAccessToken(user: UsersDocument): Promise<string> {
    const login = user.getLogin();
    const password = user.getPassword();
    const email = user.getEmail();
    const userId = user._id;
    const isConfirmed = user.getIsConfirmed();

    const payload = {
      login,
      password,
      email,
      userId,
      isConfirmed,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: settings.JWT_SECRET,
      expiresIn: '10sec',
    });
    return accessToken;
  }
  async createRefreshToken(
    createRefreshTokenDTO: CreateRefreshTokenDTO,
  ): Promise<string | null> {
    let refreshToken = null;

    const { user, deviceIp, deviceName } = createRefreshTokenDTO;
    const deviceId = new ObjectId();
    const createdAt = new Date();
    const userId = user._id;

    const login = user.getLogin();
    const email = user.getEmail();

    const payload = {
      login,
      email,
      userId,
      createdAt,
      deviceId,
      deviceIp,
      deviceName,
    };

    const newJwtModel = new this.JwtTokenModel();
    newJwtModel.setCreatedAt(createdAt);
    newJwtModel.setDeviceId(deviceId);
    newJwtModel.setDeviceIp(deviceIp);
    newJwtModel.setDeviceName(deviceName);
    newJwtModel.setUserId(userId);
    newJwtModel.setEmail(email);
    newJwtModel.setLogin(login);

    const isTokenSaved = await this.jwtTokensRepository.save(newJwtModel);

    if (isTokenSaved) {
      refreshToken = this.jwtService.sign(payload, {
        secret: settings.JWT_SECRET,
        expiresIn: '20sec',
      });
    } else {
      throw new BadGatewayException('token not saved');
    }
    return refreshToken;
  }
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
