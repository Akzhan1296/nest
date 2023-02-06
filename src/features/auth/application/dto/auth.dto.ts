export type RegistrationUserDTO = {
  login: string;
  password: string;
  email: string;
};

export type RegistrationConfirmationDTO = {
  code: string;
};

export type AuthDTO = {
  loginOrEmail: string;
  password: string;
  deviceName: string;
  deviceIp: string;
};
export type GetRefreshTokenDTO = {
  userId: string;
  deviceId: string;
};

export type NewPasswordDTO = {
  newPassword: string;
  recoveryCode: string;
};

export type EmailDataDTO = {
  email: string;
  code: string;
  letterTitle: string;
  letterText: string;
  codeText?: string;
};
