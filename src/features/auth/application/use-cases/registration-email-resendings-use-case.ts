import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { add } from 'date-fns';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';

export class EmailResendingCommand {
  constructor(public email: string) {}
}
@CommandHandler(EmailResendingCommand)
export class EmailResendingUseCase
  implements ICommandHandler<EmailResendingCommand>
{
  constructor(
    protected usersRepository: UsersRepository,
    protected authService: AuthService,
  ) {}

  async execute(command: EmailResendingCommand): Promise<void> {
    const userByEmail = await this.usersRepository.findUserByEmail(
      command.email,
    );
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
      await this.authService.sendEmail({
        email: command.email,
        code: newConfirmCode,
        letterTitle: 'Registration code resending',
        letterText: 'Confirm code',
      });
      this.usersRepository.save(userByEmail);
    } catch (err) {
      throw new Error(err);
    }
  }
}
