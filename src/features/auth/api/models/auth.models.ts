import {
  MinLength,
  MaxLength,
  Matches,
  IsString,
  IsMongoId,
} from 'class-validator';

export class AuthLoginInputModal {
  @IsString()
  loginOrEmail: string;
  @IsString()
  password: string;
}

export class AuthRegistrationInputModal {
  @MinLength(3)
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9_-]*$/, { message: 'incorrect login' })
  login: string;
  @MinLength(6)
  @MaxLength(20)
  password: string;
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class AuthRegistrationConfirmInputModal {
  @IsMongoId()
  code: string;
}
export class AuthEmailResendingInputModal {
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class NewPasswordInputModal {
  @IsString()
  newPassword: string;
  @MinLength(6)
  @MaxLength(20)
  @IsMongoId()
  recoveryCode: string;
}
