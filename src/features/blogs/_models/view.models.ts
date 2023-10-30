export interface BlogViewModel {
  name: string;
  id: string;
  websiteUrl: string;
  createdAt: Date;
  description: string;
  isMembership: boolean;
  isBanned?: boolean;
}

export interface BlogSAViewModel extends BlogViewModel {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
  banInfo: {
    isBanned: boolean;
    banDate: Date | null;
  };
}

export interface BannedUserForBlog {
  id: string;
  login: string;
  banInfo: {
    isBanned: boolean;
    banDate: Date;
    banReason: string;
  };
}
