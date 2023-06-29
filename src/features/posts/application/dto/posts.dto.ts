export type CreatePostDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  userId: string;
};

export type CreateCommentDTO = {
  content: string;
};
