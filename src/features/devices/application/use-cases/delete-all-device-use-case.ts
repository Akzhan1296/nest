import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtTokensRepository } from '../../../jwt/infrastructura/repository/jwt.repository';

export class DeleteDevicesExceptOneCommand {
  constructor(public deviceId: string) {}
}
@CommandHandler(DeleteDevicesExceptOneCommand)
export class DeleteDevicesExceptOneUseCase
  implements ICommandHandler<DeleteDevicesExceptOneCommand>
{
  constructor(protected jwtTokensRepository: JwtTokensRepository) {}
  async execute(command: DeleteDevicesExceptOneCommand): Promise<boolean> {
    return this.jwtTokensRepository.deleteDevicesExceptOne(command.deviceId);
  }
}
