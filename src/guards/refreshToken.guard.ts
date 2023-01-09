import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RefreshTokenPayloadDTO } from '../jwt/application/dto/jwt.dto';
import { JwtTokensQueryRepository } from '../jwt/infrastructura/repository/jwt.query.repository';
import { settings } from '../settings';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private jwtTokensQueryRepository: JwtTokensQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.cookie) {
      throw new UnauthorizedException();
    }
    let refreshTokenFromBlackList = null;
    const refreshToken = request.headers.cookie.split('=')[1];
    let payload = null;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: settings.JWT_SECRET,
      }) as RefreshTokenPayloadDTO;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
    if (
      payload &&
      payload.refreshTokenId &&
      payload.refreshTokenId.length > 0
    ) {
      refreshTokenFromBlackList =
        await this.jwtTokensQueryRepository.findRefreshTokenById(
          payload.refreshTokenId,
        );
    }

    if (refreshTokenFromBlackList) {
      throw new UnauthorizedException();
    }

    request.body.refreshTokenId = payload.refreshTokenId;
    request.body.userId = payload.userId;

    return true;
  }
}
