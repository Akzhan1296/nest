import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { JwtTokensRepository } from '../../../jwt/infrastructura/repository/jwt.repository';
import { DeleteDeviceDTO } from './../dto/devices.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteCurrentDeviceCommand {
  constructor(public deleteDeviceDTO: DeleteDeviceDTO) {}
}

@CommandHandler(DeleteCurrentDeviceCommand)
export class DeleteCurrentDeviceUseCase
  implements ICommandHandler<DeleteCurrentDeviceCommand>
{
  constructor(
    protected usersRepository: UsersRepository,
    protected jwtTokensRepository: JwtTokensRepository,
  ) {}

  async execute(command: DeleteCurrentDeviceCommand): Promise<boolean> {
    const user = await this.usersRepository.findUserById(
      command.deleteDeviceDTO.userId,
    ); // from jwt

    const device = await this.jwtTokensRepository.getJwtByDeviceId(
      command.deleteDeviceDTO.deviceId,
    ); //from params

    if (!device) throw new NotFoundException();
    if (user._id.toString() !== device.getUserId().toString()) {
      throw new ForbiddenException();
    }
    return this.jwtTokensRepository.delete(device);
  }
}
