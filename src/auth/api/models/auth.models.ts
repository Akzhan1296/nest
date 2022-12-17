import { MinLength, MaxLength, Matches, IsString } from 'class-validator';

export class AuthLoginInputModal {
  @IsString()
  loginOrEmail: string;
  @IsString()
  password: string;
}

export class AuthRegistrationInputModal {
  @MinLength(3)
  @MaxLength(10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;
  @MinLength(6)
  @MaxLength(20)
  password: string;
  @IsString()
  // eslint-disable-next-line prettier/prettier
  @Matches('^[w-.]+@([w-]+.)+[w-]{2,4}$')
  email: string;
}

export class AuthRegistrationConfirmInputModal {
  @IsString()
  code: string;
}
export class AuthEmailResendingInputModal {
  // eslint-disable-next-line prettier/prettier
  @Matches('^[w-.]+@([w-]+.)+[w-]{2,4}$')
  email: string;
}
