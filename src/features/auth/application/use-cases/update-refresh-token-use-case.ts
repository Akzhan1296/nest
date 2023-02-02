import { Injectable, NotFoundException } from '@nestjs/common';
import { GetRefreshTokenDTO } from './../dto/auth.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { AuthJwtService } from '../../../jwt/application/jwt.service';

@Injectable()
export class UpdateRefreshTokenUseCase {
  constructor(
    protected usersRepository: UsersRepository,
    protected authJwtService: AuthJwtService,
  ) {}

  async execute(
    getRefreshTokenDTO: GetRefreshTokenDTO,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.usersRepository.findUserById(
      getRefreshTokenDTO.userId,
    );

    if (user) {
      const accessToken = await this.authJwtService.createAccessToken(user);
      const refreshToken = await this.authJwtService.updateRefreshToken(
        getRefreshTokenDTO.deviceId,
      );
      return { accessToken, refreshToken };
    }
    throw new NotFoundException({ message: 'User not found' });
  }
}
