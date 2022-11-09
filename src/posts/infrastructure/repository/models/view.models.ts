export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type CommentViewModel = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
};
