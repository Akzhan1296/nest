// schema

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JwtTokensDocument = HydratedDocument<JwtTokens>;

@Schema({ timestamps: true })
export class JwtTokens {
  @Prop()
  private refreshTokenId: string;

  @Prop()
  createdAt: Date;

  setRefreshTokenId(refreshTokenId: string) {
    this.refreshTokenId = refreshTokenId;
  }
  getRefreshTokenId() {
    return this.refreshTokenId;
  }
}

export const JwtSchema = SchemaFactory.createForClass(JwtTokens);
JwtSchema.methods.getRefreshTokenId = JwtTokens.prototype.getRefreshTokenId;
JwtSchema.methods.setRefreshTokenId = JwtTokens.prototype.setRefreshTokenId;
