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
  refreshTokenId: string;
};
