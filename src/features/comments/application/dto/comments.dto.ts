export type CreateCommentDTO = {
  userId: string;
  content: string;
  postId: string;
};

export type UpdateCommentDTO = {
  content: string;
  userId: string;
  commentId: string;
};

export type DeleteCommentDTO = {
  userId: string;
  commentId: string;
};
