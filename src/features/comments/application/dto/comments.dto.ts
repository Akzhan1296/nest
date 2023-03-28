import { ObjectId } from 'mongodb';
export interface CreateCommentDTO {
  userId: ObjectId;
  content: string;
  postId: string;
}

export interface CreateCommentWithUserLogin extends CreateCommentDTO {
  userLogin: string;
}

export type UpdateCommentDTO = {
  content: string;
  userId: string;
  commentId: string;
};

export type DeleteCommentDTO = {
  userId: string;
  commentId: string;
};
