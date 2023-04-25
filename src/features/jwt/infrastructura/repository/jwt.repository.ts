import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtTokens, JwtTokensDocument } from '../../domain/jwt.schema';
import { Repository } from '../../../../common/common-repository-types';

@Injectable()
export class JwtTokensRepository extends Repository<JwtTokensDocument> {
  constructor(
    @InjectModel(JwtTokens.name)
    private readonly JwtTokenModel: Model<JwtTokensDocument>,
  ) {
    super();
  }
  async getJwtByDeviceId(deviceId: string) {
    const deviceIdObject = new ObjectId(deviceId);
    return await this.JwtTokenModel.findOne({ deviceId: deviceIdObject });
  }
  async getJwtByDeviceName(deviceName: string, userId: ObjectId) {
    return await this.JwtTokenModel.findOne({ deviceName, userId });
  }
  async getJwtByUserId(userId: string) {
    const userObjectId = new ObjectId(userId);
    return await this.JwtTokenModel.findOne({ userId: userObjectId });
  }
  async deleteDevicesExceptOne(deviceId: string) {
    const deviceIdObject = new ObjectId(deviceId);
    return await this.JwtTokenModel.remove({
      deviceId: { $ne: deviceIdObject },
    });
  }
}
