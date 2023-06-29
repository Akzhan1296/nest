export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  banInfo: {
    isBanned: boolean;
    banDate: null | Date;
    banReason: null | string;
  };
};

export type MeViewModel = {
  userId: string;
  login: string;
  email: string;
};

// update ban info
