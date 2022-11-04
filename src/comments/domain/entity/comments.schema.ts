// schema
import { ObjectId } from 'mongodb';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop()
  userId: ObjectId;
  @Prop()
  userLogin: string;
  @Prop()
  content: string;
  @Prop()
  createdAt: Date;
  @Prop()
  postId: ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
