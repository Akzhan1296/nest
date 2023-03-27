import { MinLength, MaxLength, IsIn } from 'class-validator';

const likes = ['None', 'Like', 'Dislike'] as const;
export type Likes = typeof likes[number];

export class CommentInputModelType {
  @MaxLength(100)
  @MinLength(20)
  content: string;
}

export class CommentLikeStatus {
  @IsIn(likes)
  likeStatus: Likes;
}
