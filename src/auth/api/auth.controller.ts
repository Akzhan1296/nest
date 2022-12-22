import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import {
  AuthEmailResendingInputModal,
  AuthLoginInputModal,
  AuthRegistrationConfirmInputModal,
  AuthRegistrationInputModal,
} from './models/auth.models';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}
  @Post('login')
  @HttpCode(201)
  async login(@Body() inputModel: AuthLoginInputModal) {
    return this.authService.login(inputModel);
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
  async getMe() {
    return null;
  }
}
