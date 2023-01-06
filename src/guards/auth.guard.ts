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

@Injectable()

// : boolean | Promise<boolean> | Observable<boolean>
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
      payload = this.jwtService.decode(token) as JwtPayloadDTO;
    } catch (err) {
      throw new Error(err);
    }

    if (payload && payload.userId && payload.userId.length > 0) {
      user = await this.usersQueryRepository.findUserById(payload.id);
    }
    if (user) {
      request.body.userId = payload.id;
      return true;
    }
    throw new UnauthorizedException();
  }
}
