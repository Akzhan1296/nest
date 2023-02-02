import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersDocument } from '../../../users/domain/entity/users.schema';
import { settings } from '../../../../settings';
import { JwtTokens } from '../../domain/jwt.schema';
import { JwtTokensRepository } from '../../infrastructura/repository/jwt.repository';

@Injectable()
export class CreateAccessTokenUseCase {
  constructor(
    @InjectModel(JwtTokens.name)
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
}
