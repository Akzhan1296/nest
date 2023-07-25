import { ObjectId } from 'mongodb';

//to create Blog
export class BlogItemType {
  constructor(
    public name: string,
    public websiteUrl: string,
    public createdAt: Date,
    public description: string,
    public ownerId: ObjectId | null,
    public ownerLogin: string | null,
    public isBanned: boolean,
  ) {}
}

export class BlogItemDBType extends BlogItemType {
  _id: ObjectId;
}

export type SearchTermBlogs = { name: RegExp };
