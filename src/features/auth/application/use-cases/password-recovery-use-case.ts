import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { emailAdapter } from '../../../../common/adapter';
import { add } from 'date-fns';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';

@Injectable()
export class PasswordRecoveryUseCase {
  constructor(protected usersRepository: UsersRepository) {}

  async execute(email: string): Promise<void> {
    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (!userByEmail) {
      return;
    }

    const newConfirmCode = new ObjectId().toString();
    userByEmail.setConfirmCode(newConfirmCode);
    userByEmail.setEmailExpirationDate(
      add(new Date(), {
        minutes: 3,
      }),
    );
    try {
      await emailAdapter.sendEmail(
        email,
        'Nest',
        `<a href="http://localhost:5005/?recoveryCode=${newConfirmCode}">Recovery Code</a>`,
      );
      this.usersRepository.save(userByEmail);
    } catch (err) {
      throw new Error(err);
    }
  }
}
