import { Injectable } from '@nestjs/common';
import { emailAdapter } from '../../../common/adapter';
import { EmailDataDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  async sendEmail(emailDataDTO: EmailDataDTO) {
    const { code, email, letterText, letterTitle } = emailDataDTO;
    await emailAdapter.sendEmail(
      email,
      `${letterTitle}`,
      `<a href="http://localhost:5005/?code=${code}">${letterText}</a>`,
    );
  }
}
