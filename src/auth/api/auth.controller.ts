import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import {
  AuthEmailResendingInputModal,
  AuthLoginInputModal,
  AuthRegistrationConfirmInputModal,
  AuthRegistrationInputModal,
} from './models/auth.models';

@Controller('auth')
export class AuthController {
  @Post('/login')
  @HttpCode(201)
  async login(@Body() inputModel: AuthLoginInputModal) {
    return null;
  }
  @Post('/registration-confirmation')
  async registrationConfirmation(
    @Body() inputModel: AuthRegistrationConfirmInputModal,
  ) {
    return null;
  }
  @Post('/registration')
  async registration(@Body() inputModel: AuthRegistrationInputModal) {
    return null;
  }
  @Post('/registration-email-resending')
  async registrationEmailResending(
    @Body() inputModel: AuthEmailResendingInputModal,
  ) {
    return null;
  }
  @Get('/me')
  async getMe() {
    return null;
  }
}
