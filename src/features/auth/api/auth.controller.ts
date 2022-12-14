import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../../../guards/auth.guard';
import { RefreshTokenGuard } from '../../../guards/refreshToken.guard';
import { AuthJwtService } from '../../jwt/application/jwt.service';
import { MeViewModel } from '../../users/infrastructure/models/view.models';
import { UsersQueryRepository } from '../../users/infrastructure/repository/users.query.repository';
import { AuthService } from '../application/auth.service';
import {
  AuthEmailResendingInputModal,
  AuthLoginInputModal,
  AuthRegistrationConfirmInputModal,
  AuthRegistrationInputModal,
} from './models/auth.models';
@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected authJwtService: AuthJwtService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Res() response: Response,
    @Body() inputModel: AuthLoginInputModal,
  ): Promise<undefined> {
    const tokens = await this.authService.login(inputModel);
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
    const tokens = await this.authService.refreshToken({
      userId: request.body.userId,
      refreshTokenId: request.body.refreshTokenId,
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
    return this.authJwtService.addRefreshTokenToBlacklist(
      request.body.refreshTokenId,
    );
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body() inputModel: AuthRegistrationConfirmInputModal,
  ): Promise<boolean> {
    return this.authService.registrationConfirmation(inputModel);
  }

  @Post('registration')
  @HttpCode(204)
  async registration(
    @Body() inputModel: AuthRegistrationInputModal,
  ): Promise<void> {
    return this.authService.registrationUser(inputModel);
  }

  @Post('registration-email-resending')
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
}
