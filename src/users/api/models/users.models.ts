import { MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserInputModelType {
  // @MinLength(3)
  // @MaxLength(10)
  login: string;
  // @MinLength(6)
  // @MaxLength(20)
  password: string;
  // // @Matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
  email: string;
}
