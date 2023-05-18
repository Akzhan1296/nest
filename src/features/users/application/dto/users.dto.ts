export type CreateUserDTO = {
  login: string;
  password: string;
  email: string;
  confirmCode: string;
  isConfirmed: boolean;
  emailExpirationDate: Date;
};

export type SetBanDataDTO = {
  isBanned: boolean;
  banDate: Date | null;
  banReason: string | null;
};
