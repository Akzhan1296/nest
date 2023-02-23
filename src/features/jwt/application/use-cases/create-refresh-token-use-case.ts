import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { BadGatewayException } from '@nestjs/common';
import { settings } from '../../../../settings';
import { JwtTokens, JwtTokensDocument } from '../../domain/jwt.schema';
import { JwtTokensRepository } from '../../infrastructura/repository/jwt.repository';
import { CreateRefreshTokenDTO } from './../dto/jwt.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateRefreshTokenCommand {
  constructor(public createRefreshTokenDTO: CreateRefreshTokenDTO) {}
}
@CommandHandler(CreateRefreshTokenCommand)
export class CreateRefreshTokenUseCase
  implements ICommandHandler<CreateRefreshTokenCommand>
{
  constructor(
    @InjectModel(JwtTokens.name)
    private JwtTokenModel: Model<JwtTokensDocument>,
    protected jwtService: JwtService,
    protected jwtTokensRepository: JwtTokensRepository,
  ) {}

  async execute(command: CreateRefreshTokenCommand): Promise<string | null> {
    let refreshToken = null;

    const { user, deviceIp, deviceName } = command.createRefreshTokenDTO;
    const deviceId = new ObjectId();
    const createdAt = new Date();
    const userId = user._id;

    const login = user.getLogin();
    const email = user.getEmail();

    const payload = {
      login,
      email,
      userId,
      createdAt,
      deviceId,
      deviceIp,
      deviceName,
    };

    const newJwtModel = new this.JwtTokenModel();
    newJwtModel.setCreatedAt(createdAt);
    newJwtModel.setDeviceId(deviceId);
    newJwtModel.setDeviceIp(deviceIp);
    newJwtModel.setDeviceName(deviceName);
    newJwtModel.setUserId(userId);
    newJwtModel.setEmail(email);
    newJwtModel.setLogin(login);

    const isTokenSaved = await this.jwtTokensRepository.save(newJwtModel);

    if (isTokenSaved) {
      refreshToken = this.jwtService.sign(payload, {
        secret: settings.JWT_SECRET,
        expiresIn: '20sec',
      });
    } else {
      throw new BadGatewayException('token not saved');
    }
    return refreshToken;
  }
}
