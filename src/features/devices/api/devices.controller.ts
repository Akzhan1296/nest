import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenGuard } from '../../../guards/refreshToken.guard';
import { DevicesViewModel } from '../../jwt/infrastructura/models/view.models';
import { JwtTokensQueryRepository } from '../../jwt/infrastructura/repository/jwt.query.repository';
import { DeviceService } from '../application/devices.service';

@Controller('security/devices')
export class DevicesController {
  constructor(
    protected deviceService: DeviceService,
    protected jwtTokensQueryRepository: JwtTokensQueryRepository,
  ) {}

  @Get('')
  @UseGuards(RefreshTokenGuard)
  async getDevices(@Req() request: Request): Promise<DevicesViewModel[]> {
    return this.jwtTokensQueryRepository.getDevicesByUserId(
      request.body.userId,
    );
  }

  @Delete('')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteAllDevices(@Req() request: Request): Promise<boolean> {
    return this.deviceService.deleteAllDevicesExceptCurrent(
      request.body.deviceId,
    );
  }

  @Delete(':deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteSelectedDevice(
    @Req() request: Request,
    @Param() params: { deviceId: string },
  ): Promise<boolean> {
    return this.deviceService.deleteCurrentDevice({
      deviceId: params.deviceId,
      userId: request.body.userId,
    });
  }
}
