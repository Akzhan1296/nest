import { Users, UsersDocument } from '../../domain/entity/users.schema';
import { CreateUserDTO } from './../dto/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';

export class CreateUserCommand {
  constructor(public createUserDTO: CreateUserDTO) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(Users.name)
    protected usersService: UsersService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UsersDocument> {
    return this.usersService.createUser(command.createUserDTO);
  }
}
