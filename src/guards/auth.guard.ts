import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../users/infrastructure/repository/users.query.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDTO } from '../jwt/application/dto/jwt.dto';
import { settings } from '../settings';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }

    const token = request.headers.authorization.split(' ')[1];
    let payload = null;
    let user = null;

    try {
      payload = this.jwtService.verify(token, {
        secret: settings.JWT_SECRET,
      }) as JwtPayloadDTO;
    } catch (err) {
      throw new Error(err);
    }
    if (payload && payload.userId && payload.userId.length > 0) {
      user = await this.usersQueryRepository.findUserById(payload.userId);
    }
    if (user) {
      request.body.userId = payload.userId;
      return true;
    }
    throw new UnauthorizedException();
  }
}
