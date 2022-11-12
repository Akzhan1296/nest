import { ObjectId } from 'mongodb';

export type CreateCommentDTO = {
  userId: string;
  content: string;
  postId: ObjectId;
};

export type UpdateCommentDTO = {
  content: string;
};
