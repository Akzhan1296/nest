import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersRepository } from '../features/users/infrastructure/repository/users.repository';

@Injectable()
export class CheckBanGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const user = await this.usersRepository.findUserByEmailOrLogin(
      request.body.loginOrEmail,
    );

    if (user && !user.getIsBanned()) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
