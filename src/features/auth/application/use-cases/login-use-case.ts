import * as bcrypt from 'bcrypt';

import { UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from './../dto/auth.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { UsersDocument } from '../../../users/domain/entity/users.schema';
import { JwtTokensRepository } from '../../../jwt/infrastructura/repository/jwt.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

//command
import { UpdateUserRefreshTokenCommand } from './update-refresh-token-use-case';
import { CreateAccessTokenCommand } from '../../../jwt/application/use-cases/create-access-token-use-case';
import { CreateRefreshTokenCommand } from '../../../jwt/application/use-cases/create-refresh-token-use-case';

export class LoginCommand {
  constructor(public authDTO: AuthDTO) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private commandBus: CommandBus,
    protected usersRepository: UsersRepository,
    protected jwtTokensRepository: JwtTokensRepository, // protected createAccessTokenCommand: CreateAccessTokenCommand, // protected updateRefreshTokenUseCase: UpdateRefreshTokenUseCase,
  ) {}

  private async checkCreds(creds: AuthDTO): Promise<UsersDocument | null> {
    const foundUser = await this.usersRepository.findUserByEmailOrLogin(
      creds.loginOrEmail,
    );
    if (!foundUser) return null;
    const result = await bcrypt.compare(
      creds.password,
      foundUser.getPassword(),
    );
    if (result) {
      return foundUser;
    }
    return null;
  }

  async execute(
    command: LoginCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { deviceName, deviceIp } = command.authDTO;
    const user = await this.checkCreds(command.authDTO);
    let refreshToken = null;
    if (!user) {
      throw new UnauthorizedException({ message: 'email or login incorrect' });
    }
    refreshToken = await this.jwtTokensRepository.getJwtByDeviceName(
      deviceName,
      user._id,
    );
    if (refreshToken) {
      //update refresh token if user already logined
      return this.commandBus.execute(
        new UpdateUserRefreshTokenCommand({
          userId: user._id.toString(),
          deviceId: refreshToken.getDeviceId(),
        }),
      );
    }
    const accessToken = await this.commandBus.execute(
      new CreateAccessTokenCommand(user),
    );
    refreshToken = await this.commandBus.execute(
      new CreateRefreshTokenCommand({
        user,
        deviceName,
        deviceIp,
      }),
    );
    return { accessToken, refreshToken };
  }
}
