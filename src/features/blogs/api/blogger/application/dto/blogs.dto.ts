export type BlogType = {
  name: string;
  websiteUrl: string;
  description: string;
  userId: string;
};

export type BlogUpdateType = {
  name: string;
  websiteUrl: string;
  description: string;
};

export type BlogOwnerDTO = {
  blogId: string;
  userId: string;
};

export type UpdateOrDeletePostDTO = {
  blogId: string;
  postId: string;
  userId: string;
};

export type UpdateOrDeletePostCheckResultDTO = {
  isBlogFound: boolean;
  isPostFound: boolean;
  isForbidden: boolean;
};
