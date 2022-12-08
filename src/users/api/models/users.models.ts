import { MinLength, MaxLength, Matches } from 'class-validator';
import { PageSizeDTO } from 'src/common/common-types';

export class AddUserInputModel {
  @MinLength(3)
  @MaxLength(10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;
  @MinLength(6)
  @MaxLength(20)
  password: string;
  // @Matches('^[w-.]+@([w-]+.)+[w-]{2,4}$')
  email: string;
}

export class UsersQueryType extends PageSizeDTO {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  searchLoginTerm = '';
  searchEmailTerm = '';
  sortBy = 'createdAt';
  sortDirection = 'desc';
}
