export type HandleLikeCommentDTO = {
  commentId: string;
  commentLikeStatus: 'Like' | 'Dislike' | 'None';
  userId: string;
};

export type HandlePostLikeCommentDTO = {
  postId: string;
  postLikeStatus: 'Like' | 'Dislike' | 'None';
  userId: string;
};
