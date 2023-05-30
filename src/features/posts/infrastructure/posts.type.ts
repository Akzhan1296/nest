import { ObjectId } from 'mongodb';

export class PostItemType {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: ObjectId,
    public blogName: string,
    public createdAt: Date,
    public dislikeCount: number,
    public likeCount: number,
    public userId: ObjectId,
  ) {}
}

export type NewestUser = {
  userId: string;
  login: string;
  addedAt: Date;
};
