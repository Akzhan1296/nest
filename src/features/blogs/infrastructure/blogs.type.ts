import { ObjectId } from 'mongodb';

//to create Blog
export class BlogItemType {
  constructor(
    public name: string,
    public websiteUrl: string,
    public createdAt: Date,
    public description: string,
    public ownerId: ObjectId | null,
  ) {}
}

// db type
// export class BlogItemDBType {
//   name: string;
//   websiteUrl: string;
//   _id: ObjectId;
//   createdAt: Date;
//   description: string;
// }

export class BlogItemDBType extends BlogItemType {
  _id: ObjectId;
}

export type SearchTermBlogs = { name: RegExp };
