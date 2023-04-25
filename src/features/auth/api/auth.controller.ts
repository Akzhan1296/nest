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
import { CommandBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';

// guards
import { AuthGuard } from '../../../guards/auth.guard';
import { RefreshTokenGuard } from '../../../guards/refreshToken.guard';

// query repo
import { UsersQueryRepository } from '../../users/infrastructure/repository/users.query.repository';

// commands
import { LoginCommand } from '../application/use-cases/login-use-case';
import { NewPasswordCommand } from '../application/use-cases/new-password-use-case';
import { PasswordRecoveryCommand } from '../application/use-cases/password-recovery-use-case';
import { RegistrationConfirmationCommand } from '../application/use-cases/registration-confirmation-use-case';
import { EmailResendingCommand } from '../application/use-cases/registration-email-resendings-use-case';
import { RegistrationUserCommand } from '../application/use-cases/registration-user-use-case';
import { UpdateUserRefreshTokenCommand } from '../application/use-cases/update-refresh-token-use-case';
import { DeleteCurrentDeviceCommand } from '../../devices/application/use-cases/delete-current-device-use-case';

// models
import { MeViewModel } from '../../users/infrastructure/models/view.models';
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
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('login')
  // @UseGuards(BlockIpGuard)
  @HttpCode(200)
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Ip() deviceIp,
    @Body() inputModel: AuthLoginInputModal,
  ): Promise<undefined> {
    const tokens = await this.commandBus.execute(
      new LoginCommand({
        ...inputModel,
        deviceIp,
        deviceName: request.headers['user-agent'],
      }),
    );

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      // expires: addSeconds(new Date(), 20),
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
    const tokens = await this.commandBus.execute(
      new UpdateUserRefreshTokenCommand({
        userId: request.body.userId,
        deviceId: request.body.deviceId,
      }),
    );
    response.cookie('refreshToken', `${tokens.refreshToken}`, {
      httpOnly: true,
      secure: true,
      // expires: addSeconds(new Date(), 20),
    });
    response.status(200).send({ accessToken: tokens.accessToken });
    return;
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async logOut(@Req() request: Request, @Res() response: Response) {
    await this.commandBus.execute(
      new DeleteCurrentDeviceCommand({
        deviceId: request.body.deviceId,
        userId: request.body.userId,
      }),
    );
    return response
      .cookie('refreshToken', ``, {
        httpOnly: true,
        secure: true,
        // expires: new Date(),
      })
      .send();
  }

  @Post('registration-confirmation')
  // @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async registrationConfirmation(
    @Body() inputModel: AuthRegistrationConfirmInputModal,
  ): Promise<boolean> {
    return this.commandBus.execute(
      new RegistrationConfirmationCommand(inputModel),
    );
  }

  @Post('registration')
  // @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async registration(
    @Body() inputModel: AuthRegistrationInputModal,
  ): Promise<void> {
    return this.commandBus.execute(new RegistrationUserCommand(inputModel));
  }

  @Post('registration-email-resending')
  // @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async registrationEmailResending(
    @Body() inputModel: AuthEmailResendingInputModal,
  ): Promise<void> {
    return this.commandBus.execute(new EmailResendingCommand(inputModel.email));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() request: Request): Promise<MeViewModel> {
    return await this.usersQueryRepository.findMe(request.body.userId);
  }

  @Post('password-recovery')
  // @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async passwordRecovery(
    @Body() inputModel: AuthEmailResendingInputModal,
  ): Promise<void> {
    return this.commandBus.execute(
      new PasswordRecoveryCommand(inputModel.email),
    );
  }

  @Post('new-password')
  // @UseGuards(BlockIpGuard)
  @HttpCode(204)
  async newPassword(
    @Body() inputModal: NewPasswordInputModal,
  ): Promise<boolean> {
    return this.commandBus.execute(new NewPasswordCommand(inputModal));
  }
}
