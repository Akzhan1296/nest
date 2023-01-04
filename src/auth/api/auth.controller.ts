import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../../guards/auth.guard';
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
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() inputModel: AuthLoginInputModal) {
    const token = await this.authService.login(inputModel);
    return token;
  }
  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body() inputModel: AuthRegistrationConfirmInputModal,
  ) {
    return this.authService.registrationConfirmation(inputModel);
  }
  @Post('registration')
  @HttpCode(204)
  async registration(@Body() inputModel: AuthRegistrationInputModal) {
    return this.authService.registrationUser(inputModel);
  }
  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body() inputModel: AuthEmailResendingInputModal,
  ) {
    return this.authService.registrationEmailResending(inputModel.email);
  }
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() request: Request) {
    return await this.usersQueryRepository.findUserById(request.body.userId);
  }
}
