import { ObjectId } from 'mongodb';
import { emailAdapter } from '../../../../common/adapter';
import { add } from 'date-fns';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}
@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(protected usersRepository: UsersRepository) {}

  async execute(command: PasswordRecoveryCommand): Promise<void> {
    const userByEmail = await this.usersRepository.findUserByEmail(
      command.email,
    );
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
        command.email,
        'Nest',
        `<a href="http://localhost:5005/?recoveryCode=${newConfirmCode}">Recovery Code</a>`,
      );
      this.usersRepository.save(userByEmail);
    } catch (err) {
      throw new Error(err);
    }
  }
}
