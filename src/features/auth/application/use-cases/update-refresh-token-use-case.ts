import { NotFoundException } from '@nestjs/common';
import { GetRefreshTokenDTO } from './../dto/auth.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { AuthJwtService } from '../../../jwt/application/jwt.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateRefreshTokenCommand {
  constructor(public getRefreshTokenDTO: GetRefreshTokenDTO) {}
}

@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenUseCase
  implements ICommandHandler<UpdateRefreshTokenCommand>
{
  constructor(
    protected usersRepository: UsersRepository,
    protected authJwtService: AuthJwtService,
  ) {}

  async execute(
    command: UpdateRefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.usersRepository.findUserById(
      command.getRefreshTokenDTO.userId,
    );

    if (user) {
      const accessToken = await this.authJwtService.createAccessToken(user);
      const refreshToken = await this.authJwtService.updateRefreshToken(
        command.getRefreshTokenDTO.deviceId,
      );
      return { accessToken, refreshToken };
    }
    throw new NotFoundException({ message: 'User not found' });
  }
}
