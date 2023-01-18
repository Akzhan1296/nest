import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import { JwtTokensRepository } from '../../jwt/infrastructura/repository/jwt.repository';
import { DeleteDeviceDTO } from './dto/devices.dto';

@Injectable()
export class DeviceService {
  constructor(
    protected usersRepository: UsersRepository,
    protected jwtTokensRepository: JwtTokensRepository,
  ) {}

  async deleteCurrentDevice(
    deleteDeviceDTO: DeleteDeviceDTO,
  ): Promise<boolean> {
    const user = await this.usersRepository.findUserById(
      deleteDeviceDTO.userId,
    );
    const device = await this.jwtTokensRepository.getJwtByDeviceId(
      deleteDeviceDTO.deviceId,
    );
    if (!device) throw new NotFoundException();
    if (user._id.toString() !== device.getUserId().toString())
      throw new ForbiddenException();
    return this.jwtTokensRepository.delete(device);
  }

  async deleteAllDevicesExceptCurrent(deviceId: string): Promise<boolean> {
    return this.jwtTokensRepository.deleteDevicesExceptOne(deviceId);
  }
}
