import { ObjectId } from 'mongodb';

export type CreatePostDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
};

export type CreateCommentDTO = {
  content: string;
};
