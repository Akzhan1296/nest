import { UsersDocument } from '../../../users/domain/entity/users.schema';

export type JwtPayloadDTO = {
  login: string;
  password: string;
  email: string;
  userId: string;
  isConfirmed: boolean;
};

export type RefreshTokenPayloadDTO = {
  login: string;
  email: string;
  userId: string;
};

export type CreateRefreshTokenDTO = {
  deviceIp: string;
  deviceName: string;
  user: UsersDocument;
};
