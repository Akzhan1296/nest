import { ObjectId } from 'mongodb';

export type CreateCommentDTO = {
  userId: ObjectId;
  userLogin: string;
  content: string;
  addedAt: Date;
  postId: ObjectId;
};

export type UpdateCommentDTO = {
  content: string;
};
