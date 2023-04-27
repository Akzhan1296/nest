import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RefreshTokenPayloadDTO } from '../features/jwt/application/dto/jwt.dto';
import { JwtTokensQueryRepository } from '../features/jwt/infrastructura/repository/jwt.query.repository';
import { settings } from '../settings';
import { Utils } from '../common/utils';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtTokensQueryRepository: JwtTokensQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { refreshToken } = request.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    let payload = null;
    let jwtTokenByIds = null;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: settings.JWT_SECRET,
      }) as RefreshTokenPayloadDTO;
    } catch (err) {
      throw new UnauthorizedException();
    }
    if (payload) {
      jwtTokenByIds =
        await this.jwtTokensQueryRepository.getJwtByUserAndDeviceId(
          await Utils.transformObjectId(payload.userId),
          await Utils.transformObjectId(payload.deviceId),
        );
    }

    if (!jwtTokenByIds) throw new UnauthorizedException();
    if (
      jwtTokenByIds.createdAt.getTime() !==
      new Date(payload.createdAt).getTime()
    ) {
      throw new UnauthorizedException();
    }

    request.body.userId = payload.userId; // from jwt payload
    request.body.deviceId = payload.deviceId; // from jwt payload

    return true;
  }
}
