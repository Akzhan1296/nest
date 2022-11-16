import { MaxLength, MinLength } from 'class-validator';

export class PostInputModel {
  @MaxLength(30)
  public title: string;
  @MaxLength(100)
  public shortDescription: string;
  @MaxLength(1000)
  public content: string;
  public blogId: string;
}

export class CreateCommentInputModel {
  @MinLength(20)
  @MaxLength(300)
  public content: string;
}
