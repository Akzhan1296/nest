import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { BadGatewayException } from '@nestjs/common';
import { settings } from '../../../../settings';
import { JwtTokens } from '../../domain/jwt.schema';
import { JwtTokensRepository } from '../../infrastructura/repository/jwt.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateRefreshTokenCommand {
  constructor(public deviceId: string) {}
}
@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenUseCase
  implements ICommandHandler<UpdateRefreshTokenCommand>
{
  constructor(
    @InjectModel(JwtTokens.name)
    protected jwtTokensRepository: JwtTokensRepository,
    protected jwtService: JwtService,
  ) {}

  async execute(command: UpdateRefreshTokenCommand): Promise<string | null> {
    let updatedRefreshToken = null;

    const refreshTokenMetaData =
      await this.jwtTokensRepository.getJwtByDeviceId(command.deviceId);

    refreshTokenMetaData.setCreatedAt(new Date());
    const isTokenSaved = await this.jwtTokensRepository.save(
      refreshTokenMetaData,
    );

    const payload = {
      login: refreshTokenMetaData.getLogin(),
      email: refreshTokenMetaData.getEmail(),
      userId: refreshTokenMetaData.getUserId(),
      createdAt: refreshTokenMetaData.getCreatedAt(),
      deviceId: refreshTokenMetaData.getDeviceId(),
      deviceIp: refreshTokenMetaData.getDeviceIp(),
      deviceName: refreshTokenMetaData.getDeviceName(),
    };

    if (isTokenSaved) {
      updatedRefreshToken = this.jwtService.sign(payload, {
        secret: settings.JWT_SECRET,
        expiresIn: '20sec',
      });
    } else {
      throw new BadGatewayException('token not saved');
    }
    return updatedRefreshToken;
  }
}
