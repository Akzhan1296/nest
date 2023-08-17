import { ObjectId } from 'mongodb';

export type BannedUserBlogType = {
  banReason: null | string;
  isBanned: boolean;
  userId: string;
  userLogin: string;
  banDate: Date;
};

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
    public banDate: Date | null,
  ) {}
}

export class BlogItemDBType extends BlogItemType {
  _id: ObjectId;
}

export type SearchTermBlogs = { name: RegExp };
