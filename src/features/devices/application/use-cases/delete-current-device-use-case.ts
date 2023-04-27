import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { JwtTokensRepository } from '../../../jwt/infrastructura/repository/jwt.repository';
import { DeleteDeviceDTO } from './../dto/devices.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Utils } from '../../../../common/utils';

export class DeleteCurrentDeviceCommand {
  constructor(public deleteDeviceDTO: DeleteDeviceDTO) {}
}

@CommandHandler(DeleteCurrentDeviceCommand)
export class DeleteCurrentDeviceUseCase
  implements ICommandHandler<DeleteCurrentDeviceCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtTokensRepository: JwtTokensRepository,
  ) {}

  async execute(command: DeleteCurrentDeviceCommand): Promise<boolean> {
    const user = await this.usersRepository.findUserById(
      command.deleteDeviceDTO.userId,
    ); // from jwt

    const device = await this.jwtTokensRepository.getJwtByDeviceId(
      await Utils.transformObjectId(command.deleteDeviceDTO.deviceId),
    ); //from params

    if (!device) throw new NotFoundException();
    if (user._id.toString() !== device.getUserId().toString()) {
      throw new ForbiddenException();
    }
    return await this.jwtTokensRepository.delete(device);
  }
}
