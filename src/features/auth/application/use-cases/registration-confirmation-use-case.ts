import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegistrationConfirmationDTO } from './../dto/auth.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';

@Injectable()
export class RegistrationConfirmationUseCase {
  constructor(protected usersRepository: UsersRepository) {}

  async execute(confirmCode: RegistrationConfirmationDTO): Promise<boolean> {
    const userByConfirmCode = await this.usersRepository.findUserByConfirmCode(
      confirmCode.code,
    );
    if (!userByConfirmCode)
      throw new NotFoundException('user by this confirm code not found');
    const code = userByConfirmCode.getConfirmCode();
    const confirmCodeExpDate = userByConfirmCode.getEmailExpirationDate();
    const isConfirmed = userByConfirmCode.getIsConfirmed();
    if (isConfirmed)
      throw new BadRequestException({
        message: 'Email is already confirmed',
        field: 'code',
      });
    if (code === confirmCode.code && confirmCodeExpDate > new Date()) {
      userByConfirmCode.setIsConfirmed(true);
      return await this.usersRepository.save(userByConfirmCode);
    } else {
      throw new BadRequestException('date is already expired');
    }
  }
}
