import { Matches, MaxLength } from 'class-validator';

export class BlogInputModelType {
  @MaxLength(15)
  name: string;
  // eslint-disable-next-line prettier/prettier
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @MaxLength(100)
  youtubeUrl: string;
}

export class CreatePostByBlogIdInputType {
  title: string;
  shortDescription: string;
  content: string;
}
