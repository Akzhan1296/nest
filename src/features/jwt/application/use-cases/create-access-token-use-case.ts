import { JwtService } from '@nestjs/jwt';
import { UsersDocument } from '../../../users/domain/entity/users.schema';
import { settings } from '../../../../settings';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateAccessTokenCommand {
  constructor(public user: UsersDocument) {}
}
@CommandHandler(CreateAccessTokenCommand)
export class CreateAccessTokenUseCase
  implements ICommandHandler<CreateAccessTokenCommand>
{
  constructor(protected jwtService: JwtService) {}
  async execute(command: CreateAccessTokenCommand): Promise<string> {
    const { user } = command;
    const login = user.getLogin();
    const password = user.getPassword();
    const email = user.getEmail();
    const userId = user._id;
    const isConfirmed = user.getIsConfirmed();

    const payload = {
      login,
      password,
      email,
      userId,
      isConfirmed,
    };
    console.log(this.jwtService.sign);
    const accessToken = this.jwtService.sign(payload, {
      secret: settings.JWT_SECRET,
      expiresIn: '10sec',
    });
    return accessToken;
  }
}
