import { Users, UsersDocument } from '../../domain/entity/users.schema';
import { CreateUserDTO } from './../dto/users.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../../infrastructure/repository/users.repository';
import { generateHash } from '../../../../common/utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateUserCommand {
  constructor(public createUserDTO: CreateUserDTO) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(Users.name)
    private UsersModel: Model<UsersDocument>,
    protected usersRepository: UsersRepository,
  ) {}

  private async _createUser(
    createUserDTO: CreateUserDTO,
  ): Promise<UsersDocument> {
    const newUser = new this.UsersModel();
    try {
      newUser.createUser(createUserDTO);
    } catch (err) {
      throw new Error(err);
    }

    return newUser;
  }
  async execute(command: CreateUserCommand): Promise<UsersDocument> {
    const { password, ...restCreateUserData } = command.createUserDTO;
    const passwordHash = await generateHash(password);
    const newUser = await this._createUser({
      ...restCreateUserData,
      password: passwordHash,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }
}
