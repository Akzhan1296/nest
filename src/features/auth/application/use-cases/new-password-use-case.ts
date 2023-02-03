import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NewPasswordDTO } from './../dto/auth.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { generateHash } from '../../../../common/utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class NewPasswordCommand {
  constructor(public newPasswordDTO: NewPasswordDTO) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
  constructor(protected usersRepository: UsersRepository) {}

  async execute(command: NewPasswordCommand): Promise<boolean> {
    const { recoveryCode, newPassword } = command.newPasswordDTO;
    const userByConfirmCode = await this.usersRepository.findUserByConfirmCode(
      recoveryCode,
    );
    if (!userByConfirmCode)
      throw new NotFoundException('user by this confirm code not found');

    const code = userByConfirmCode.getConfirmCode();
    const confirmCodeExpDate = userByConfirmCode.getEmailExpirationDate();

    if (code === recoveryCode && confirmCodeExpDate > new Date()) {
      const passwordHash = await generateHash(newPassword);
      userByConfirmCode.setPassword(passwordHash);
      return await this.usersRepository.save(userByConfirmCode);
    } else {
      throw new BadRequestException('date is already expired');
    }
  }
}
