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
};

export type JwtPayloadDTO = {
  login: string;
  password: string;
  email: string;
  id: string;
  isConfirmed: boolean;
};
