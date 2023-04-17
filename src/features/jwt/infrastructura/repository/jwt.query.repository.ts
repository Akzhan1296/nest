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
    private JwtTokenModel: Model<JwtTokensDocument>,
  ) {}
  async getDevicesByUserId(userId: string): Promise<DevicesViewModel[]> {
    const userObjectId = new ObjectId(userId);
    const tokensMetaData = await this.JwtTokenModel.find({
      userId: userObjectId,
    });
    return tokensMetaData.map((tokenData) => ({
      ip: tokenData.getDeviceIp(),
      title: tokenData.getDeviceName(),
      lastActiveDate: tokenData.getCreatedAt().toISOString(),
      deviceId: tokenData.getDeviceId().toString(),
    }));
  }
  async getJwtByUserAndDeviceId(userId: string, deviceId: string) {
    const userObjectId = new ObjectId(userId);
    const deviceObjectId = new ObjectId(deviceId);
    return await this.JwtTokenModel.findOne({
      userId: userObjectId,
      deviceId: deviceObjectId,
    }).lean();
  }
  async dropJwts() {
    return this.JwtTokenModel.deleteMany({});
  }
}
