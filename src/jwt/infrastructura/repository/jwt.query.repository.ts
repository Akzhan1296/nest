import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtTokens, JwtTokensDocument } from '../../domain/jwt.schema';

@Injectable()
export class JwtTokensQueryRepository {
  constructor(
    @InjectModel(JwtTokens.name)
    private JwtTokenModel: Model<JwtTokensDocument>,
  ) {}
  async findRefreshTokenById(
    refreshTokenId: string,
  ): Promise<JwtTokensDocument> {
    return await this.JwtTokenModel.findOne({ refreshTokenId });
  }
}
