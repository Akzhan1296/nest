export type CreateUserDTO = {
  login: string;
  password: string;
  email: string;
  confirmCode: string;
  isConfirmed: boolean;
  emailExpirationDate: Date;
};
