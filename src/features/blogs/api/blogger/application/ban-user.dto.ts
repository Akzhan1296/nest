export type BanUserBlogResultDTO = {
  isUserFound: boolean;
  isUserBanned: boolean;
  isFoubidden: boolean;
};

export type BanUserBlogDTO = {
  isBanned: boolean;
  banReason: string | null;
  blogId: string;
  userId: string;
  ownerId: string;
};
