import { ObjectId } from 'mongodb';
import { add } from 'date-fns';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}
@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: PasswordRecoveryCommand): Promise<void> {
    const userByEmail = await this.usersRepository.findUserByEmail(
      command.email,
    );
    if (!userByEmail) {
      return;
    }

    const newRecoveryCode = new ObjectId().toString();
    userByEmail.setConfirmCode(newRecoveryCode);
    userByEmail.setEmailExpirationDate(
      add(new Date(), {
        minutes: 3,
      }),
    );
    try {
      await this.authService.sendEmail({
        email: command.email,
        code: newRecoveryCode,
        letterTitle: 'Password recovery',
        letterText: 'Recovery Code',
        codeText: 'recoveryCode',
      });
      this.usersRepository.save(userByEmail);
    } catch (err) {
      throw new Error(err);
    }
  }
}
