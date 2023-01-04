export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserViewModelWithoutDate = {
  id: string;
  login: string;
  email: string;
};
