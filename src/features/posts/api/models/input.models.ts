import { IsIn, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { PageSizeDTO } from '../../../../common/common-types';
// import { Transform } from 'class-transformer';
// import { IsBlogExist } from './post.decorator';

// export class PostInputModel {
//   @Transform(({ value }) => value.trim())
//   @IsNotEmpty()
//   @MaxLength(30)
//   title: string;
//   @Transform(({ value }) => value.trim())
//   @IsNotEmpty()
//   @MaxLength(100)
//   shortDescription: string;
//   @Transform(({ value }) => value.trim())
//   @IsNotEmpty()
//   @MaxLength(1000)
//   content: string;
//   @IsBlogExist()
//   blogId: string;
// }

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
