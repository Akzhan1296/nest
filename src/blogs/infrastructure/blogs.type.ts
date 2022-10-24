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
export type BlogType = {
  name: string;
  youtubeUrl: string;
};

//to create Blog
export class BlogItemType {
  constructor(
    public name: string,
    public youtubeUrl: string,
    public createdAt: Date,
  ) {}
}

// db type
export class BlogItemDBType {
  name: string;
  youtubeUrl: string;
  _id: ObjectId;
  createdAt: Date;
}
// which will be returned in controllers
export type BlogViewModel = {
  name: string;
  id: string;
  youtubeUrl: string;
  createdAt: Date;
};
