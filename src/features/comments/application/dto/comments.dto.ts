export interface CreateCommentDTO {
  userId: string;
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
