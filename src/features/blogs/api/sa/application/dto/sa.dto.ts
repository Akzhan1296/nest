export type BanBlogDTO = {
  isBanned: boolean;
  blogId: string;
};

export type BanBlogResultDTO = {
  isBlogFound: boolean;
  isBlogBanned: boolean;
};
