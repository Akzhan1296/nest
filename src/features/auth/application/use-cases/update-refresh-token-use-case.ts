import { NotFoundException } from '@nestjs/common';
import { GetRefreshTokenDTO } from './../dto/auth.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccessTokenCommand } from '../../../jwt/application/use-cases/create-access-token-use-case';
import { UpdateRefreshTokenCommand } from '../../../jwt/application/use-cases/update-refresh-token-use-case';

export class UpdateUserRefreshTokenCommand {
  constructor(public getRefreshTokenDTO: GetRefreshTokenDTO) {}
}

@CommandHandler(UpdateUserRefreshTokenCommand)
export class UpdateUserRefreshTokenUseCase
  implements ICommandHandler<UpdateUserRefreshTokenCommand>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    command: UpdateUserRefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.usersRepository.findUserById(
      command.getRefreshTokenDTO.userId,
    );

    if (user) {
      const accessToken = await this.commandBus.execute(
        new CreateAccessTokenCommand(user),
      );
      const refreshToken = await this.commandBus.execute(
        new UpdateRefreshTokenCommand(command.getRefreshTokenDTO.deviceId),
      );
      return { accessToken, refreshToken };
    }
    throw new NotFoundException({ message: 'User not found' });
  }
}
