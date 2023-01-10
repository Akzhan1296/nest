import { UsersDocument } from '../../users/domain/entity/users.schema';
import { JwtService } from '@nestjs/jwt';
import { settings } from '../../../settings';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { JwtTokens, JwtTokensDocument } from '../domain/jwt.schema';
import { Model } from 'mongoose';
import { JwtTokensRepository } from '../infrastructura/repository/jwt.repository';
import { InjectModel } from '@nestjs/mongoose';

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
  async createRefreshToken(user: UsersDocument): Promise<string> {
    const userId = user._id;
    const refreshTokenId = new ObjectId().toString();
    const login = user.getLogin();
    const email = user.getEmail();

    const payload = {
      userId,
      refreshTokenId,
      login,
      email,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: settings.JWT_SECRET,
      expiresIn: '20sec',
    });
    return refreshToken;
  }
  async addRefreshTokenToBlacklist(refreshTokenId: string): Promise<boolean> {
    const newJwtModel = new this.JwtTokenModel();
    newJwtModel.setRefreshTokenId(refreshTokenId);
    return await this.jwtTokensRepository.save(newJwtModel);
  }
}
