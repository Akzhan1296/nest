import { ObjectId } from 'mongodb';

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
