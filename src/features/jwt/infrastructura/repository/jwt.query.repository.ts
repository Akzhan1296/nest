import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtTokens, JwtTokensDocument } from '../../domain/jwt.schema';
import { DevicesViewModel } from '../models/view.models';

@Injectable()
export class JwtTokensQueryRepository {
  constructor(
    @InjectModel(JwtTokens.name)
    private readonly JwtTokenModel: Model<JwtTokensDocument>,
  ) {}
  async getDevicesByUserId(userId: ObjectId): Promise<DevicesViewModel[]> {
    const tokensMetaData = await this.JwtTokenModel.find({
      userId,
    });
    return tokensMetaData.map((tokenData) => ({
      ip: tokenData.getDeviceIp(),
      title: tokenData.getDeviceName(),
      lastActiveDate: tokenData.getCreatedAt().toISOString(),
      deviceId: tokenData.getDeviceId().toString(),
    }));
  }
  async getJwtByUserAndDeviceId(userId: ObjectId, deviceId: ObjectId) {
    return await this.JwtTokenModel.findOne({
      userId,
      deviceId,
    }).lean();
  }
}
