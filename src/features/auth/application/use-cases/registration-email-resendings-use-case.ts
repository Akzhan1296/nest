import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { emailAdapter } from '../../../../common/adapter';
import { add } from 'date-fns';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';

@Injectable()
export class EmailResendingUseCase {
  constructor(protected usersRepository: UsersRepository) {}

  async execute(email: string): Promise<void> {
    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (!userByEmail) {
      throw new BadRequestException({
        message: 'user with this email not found',
        field: 'email',
      });
    }

    if (userByEmail.getIsConfirmed())
      throw new BadRequestException({
        message: 'Email is already confirmed',
        field: 'email',
      });
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
        `<a href="http://localhost:5005/?code=${newConfirmCode}">Confirm email</a>`,
      );
      this.usersRepository.save(userByEmail);
    } catch (err) {
      throw new Error(err);
    }
  }
}
