export type HandleLikeCommentDTO = {
  commentId: string;
  commentLikeStatus: 'Like' | 'Dislike' | 'None';
  userId: string;
};
