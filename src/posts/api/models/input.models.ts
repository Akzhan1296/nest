import { ObjectId } from 'mongodb';

export class PostInputModel {
  //swagger
  public title: string;
  // swagger
  public shortDescription: string;
  public content: string;
  public blogId: ObjectId;
}

export class CreateCommentInputModel {
  public content: string;
}
