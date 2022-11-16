export type CreateCommentDTO = {
  userId: string;
  content: string;
  postId: string;
};

export type UpdateCommentDTO = {
  content: string;
};
