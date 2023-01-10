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

@Controller('security/devices')
export class CommentsController {
  constructor() {} // protected commentsQueryRepository: CommentsQueryRepository, // protected commentsService: CommentsService,

  @Get('')
  @UseGuards(RefreshTokenGuard)
  async getDevices(): Promise<undefined> {
    return undefined;
  }

  @Delete('')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteAllDevices(): Promise<undefined> {
    return;
  }

  @Delete(':deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteSelectedDevice(
    @Req() request: Request,
    @Param() params: { deviceId: string },
  ): Promise<undefined> {
    return;
  }
}
