import { Matches, MaxLength } from 'class-validator';
import { ObjectId } from 'mongodb';

// controller type
export class BlogInputModelType {
  @MaxLength(15)
  name: string;
  // eslint-disable-next-line prettier/prettier
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @MaxLength(100)
  youtubeUrl: string;
}

// application type
export class BlogType {
  public name: string;
  public youtubeUrl: string;
}

// db type
export class BlogItemDBType {
  name: string;
  youtubeUrl: string;
  id: ObjectId;
}
