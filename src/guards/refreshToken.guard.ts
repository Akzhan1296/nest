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

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private jwtTokensQueryRepository: JwtTokensQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { refreshToken } = request.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    let payload = null;
    let devices = null;
    let jwtTokenByIds = null;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: settings.JWT_SECRET,
      }) as RefreshTokenPayloadDTO;
    } catch (err) {
      throw new UnauthorizedException();
    }
    if (payload) {
      devices = await this.jwtTokensQueryRepository.getDevicesByUserId(
        payload.userId,
      );
    } else {
      throw new UnauthorizedException();
    }

    if (!devices) throw new UnauthorizedException();

    if (payload && devices) {
      jwtTokenByIds =
        await this.jwtTokensQueryRepository.getJwtByUserAndDeviceId(
          payload.userId,
          payload.deviceId,
        );
      console.log(
        jwtTokenByIds.createdAt.getTime() !==
          new Date(payload.createdAt).getTime(),
      );
      if (
        jwtTokenByIds.createdAt.getTime() !==
        new Date(payload.createdAt).getTime()
      ) {
        throw new UnauthorizedException();
      }
    }

    request.body.userId = payload.userId; // from jwt payload
    request.body.deviceId = payload.deviceId; // from jwt payload

    return true;
  }
}
