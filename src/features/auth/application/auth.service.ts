import { Injectable } from '@nestjs/common';
import { emailAdapter } from '../../../common/adapter';
import { EmailDataDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  async sendEmail(emailDataDTO: EmailDataDTO) {
    const {
      code,
      email,
      letterText,
      letterTitle,
      codeText = 'code',
    } = emailDataDTO;
    await emailAdapter.sendEmail(
      email,
      `${letterTitle}`,
      `<a href="http://localhost:5005/?${codeText}=${code}">${letterText}</a>`,
    );
  }
}
