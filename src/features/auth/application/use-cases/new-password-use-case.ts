import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewPasswordDTO } from './../dto/auth.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { generateHash } from '../../../../common/utils';

@Injectable()
export class NewPasswordUseCase {
  constructor(protected usersRepository: UsersRepository) {}

  async execute(newPasswordData: NewPasswordDTO): Promise<boolean> {
    const userByConfirmCode = await this.usersRepository.findUserByConfirmCode(
      newPasswordData.recoveryCode,
    );
    if (!userByConfirmCode)
      throw new NotFoundException('user by this confirm code not found');

    const code = userByConfirmCode.getConfirmCode();
    const confirmCodeExpDate = userByConfirmCode.getEmailExpirationDate();

    if (
      code === newPasswordData.recoveryCode &&
      confirmCodeExpDate > new Date()
    ) {
      const passwordHash = await generateHash(newPasswordData.newPassword);
      userByConfirmCode.setPassword(passwordHash);
      return await this.usersRepository.save(userByConfirmCode);
    } else {
      throw new BadRequestException('date is already expired');
    }
  }
}
