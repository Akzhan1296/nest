import { IsIn, MaxLength, MinLength } from 'class-validator';
import { PageSizeDTO } from '../../../../common/common-types';

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

export class PostsQueryType extends PageSizeDTO {
  sortBy = 'createdAt';
  sortDirection = 'desc';
}

const likes = ['None', 'Like', 'Dislike'] as const;
export type Likes = typeof likes[number];
export class PostLikeStatus {
  @IsIn(likes)
  likeStatus: Likes;
}
