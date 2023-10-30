import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PageSizeDTO } from '../../../common/common-types';
import { IsBlogExist } from '../../posts/api/models/post.decorator';

export class BlogInputModelType {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(15)
  name: string;
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @MaxLength(100)
  websiteUrl: string;
  @MaxLength(500)
  description: string;
}

export class CreatePostByBlogIdInputType {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(30)
  title: string;
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(100)
  shortDescription: string;
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
export class BlogsQueryType extends PageSizeDTO {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  searchTermBlogs = '';
  sortBy = 'createdAt';
  sortDirection = 'desc';
}


export class BanUserForBlogInputModal {
  @IsBoolean()
  isBanned: boolean;
  @MinLength(20)
  banReason: string;
  @IsBlogExist()
  blogId: string;
}
