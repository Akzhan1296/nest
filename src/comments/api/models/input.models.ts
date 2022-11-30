import { MinLength, MaxLength } from 'class-validator';

export class CommentInputModelType {
  @MaxLength(100)
  @MinLength(20)
  content: string;
}
