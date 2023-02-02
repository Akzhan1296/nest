import { Injectable } from '@nestjs/common';
import { JwtTokensRepository } from '../../../jwt/infrastructura/repository/jwt.repository';

@Injectable()
export class DeleteAllDevicesUseCase {
  constructor(protected jwtTokensRepository: JwtTokensRepository) {}
  async deleteAllDevicesExceptCurrent(deviceId: string): Promise<boolean> {
    return this.jwtTokensRepository.deleteDevicesExceptOne(deviceId);
  }
}
