import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsersQueryRepository } from '../users/infrastructure/repository/users.query.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDTO } from '../auth/application/dto/auth.dto';

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
    const payload = this.jwtService.decode(token) as JwtPayloadDTO;
    let user = null;

    if (payload && payload.id.length > 0) {
      user = await this.usersQueryRepository.findUserById(payload.id);
    }
    if (user) {
      request.body.userId = payload.id;
      return true;
    }
    throw new UnauthorizedException();
  }
}
