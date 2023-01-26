import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../../../guards/auth.guard';
import { BlockIpGuard } from '../../../guards/ip.guard';
import { RefreshTokenGuard } from '../../../guards/refreshToken.guard';
import { DeviceService } from '../../devices/application/devices.service';
import { AuthJwtService } from '../../jwt/application/jwt.service';
import { MeViewModel } from '../../users/infrastructure/models/view.models';
import { UsersQueryRepository } from '../../users/infrastructure/repository/users.query.repository';
import { AuthService } from '../application/auth.service';
import {
  AuthEmailResendingInputModal,
  AuthLoginInputModal,
  AuthRegistrationConfirmInputModal,
  AuthRegistrationInputModal,
  NewPasswordInputModal,
} from './models/auth.models';

@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected deviceService: DeviceService,
    protected authJwtService: AuthJwtService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('login')
  @UseGuards(BlockIpGuard)
  @HttpCode(200)
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Ip() deviceIp,
    @Body() inputModel: AuthLoginInputModal,
  ): Promise<undefined> {
    const tokens = await this.authService.login({
      ...inputModel,
      deviceIp,
      deviceName: request.headers['user-agent'],
    });
    response.cookie('refreshToken', `${tokens.refreshToken}`, {
      httpOnly: true,
      secure: true,
    });
    response.status(200).send({ accessToken: tokens.accessToken });
    return;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  async refreshtoken(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<undefined> {
    const tokens = await this.authService.updateRefreshToken({
      userId: request.body.userId,
      deviceId: request.body.deviceId,
    });
    response.cookie('refreshToken', `${tokens.refreshToken}`, {
      httpOnly: true,
      secure: true,
    });
    response.status(200).send({ accessToken: tokens.accessToken });
    return;
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async logOut(@Req() request: Request): Promise<boolean> {
    return this.deviceService.deleteCurrentDevice({
      deviceId: request.body.deviceId,
      userId: request.body.userId,
    });
  }

  @Post('registration-confirmation')
  @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async registrationConfirmation(
    @Body() inputModel: AuthRegistrationConfirmInputModal,
  ): Promise<boolean> {
    return this.authService.registrationConfirmation(inputModel);
  }

  @Post('registration')
  @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async registration(
    @Body() inputModel: AuthRegistrationInputModal,
  ): Promise<void> {
    return this.authService.registrationUser(inputModel);
  }

  @Post('registration-email-resending')
  @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async registrationEmailResending(
    @Body() inputModel: AuthEmailResendingInputModal,
  ): Promise<void> {
    return this.authService.registrationEmailResending(inputModel.email);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() request: Request): Promise<MeViewModel> {
    return await this.usersQueryRepository.findMe(request.body.userId);
  }

  @Post('password-recovery')
  @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async passwordRecovery(
    @Body() inputModel: AuthEmailResendingInputModal,
  ): Promise<void> {
    return this.authService.passwordRecovery(inputModel.email);
  }

  @Post('new-password')
  @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async newPassword(
    @Body() inputModal: NewPasswordInputModal,
  ): Promise<boolean> {
    return this.authService.newPassword(inputModal);
  }
}
