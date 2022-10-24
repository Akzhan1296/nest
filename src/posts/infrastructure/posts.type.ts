import { ObjectId } from 'mongodb';

export class PostInputModel {
  //swagger
  public title: string;
  // swagger
  public shortDescription: string;
  public content: string;
  public blogId: ObjectId;
}

export type PostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
};

export class PostItemType {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: ObjectId,
    public blogName: string,
    public createdAt: Date,
  ) {}
}
export class PostItemDBType {
  public title: string;
  public shortDescription: string;
  public content: string;
  public blogId: ObjectId;
  public blogName: string;
  public _id: ObjectId;
  public createdAt: Date;
}

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};
