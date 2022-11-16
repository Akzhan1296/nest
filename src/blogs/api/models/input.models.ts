import { Matches, MaxLength } from 'class-validator';

export class BlogInputModelType {
  @MaxLength(15)
  name: string;
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @MaxLength(100)
  youtubeUrl: string;
}

export class CreatePostByBlogIdInputType {
  @MaxLength(30)
  title: string;
  @MaxLength(100)
  shortDescription: string;
  @MaxLength(1000)
  content: string;
}
