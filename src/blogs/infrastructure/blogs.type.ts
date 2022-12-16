import { ObjectId } from 'mongodb';

//to create Blog
export class BlogItemType {
  constructor(
    public name: string,
    public websiteUrl: string,
    public createdAt: Date,
    public description: string,
  ) {}
}

// db type
export class BlogItemDBType {
  name: string;
  websiteUrl: string;
  _id: ObjectId;
  createdAt: Date;
  description: string;
}

export type SearchTermBlogs = { name: RegExp };
