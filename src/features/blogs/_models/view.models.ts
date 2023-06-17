export interface BlogViewModel {
  name: string;
  id: string;
  websiteUrl: string;
  createdAt: Date;
  description: string;
  isMembership: boolean;
}

export interface BlogSAViewModel extends BlogViewModel {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
}
