import { Transform } from 'class-transformer';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { PageSizeDTO } from '../../../../common/common-types';

export class BlogInputModelType {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @MaxLength(15)
  name: string;
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @MaxLength(100)
  websiteUrl: string;
  @MaxLength(500)
  description: string;
}

export class CreatePostByBlogIdInputType {
  @MaxLength(30)
  title: string;
  @MaxLength(100)
  shortDescription: string;
  @MaxLength(1000)
  content: string;
}

export class BlogsQueryType extends PageSizeDTO {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  searchTermBlogs = '';
  sortBy = 'createdAt';
  sortDirection = 'desc';
}
