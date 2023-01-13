import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtTokens, JwtTokensDocument } from '../../domain/jwt.schema';

@Injectable()
export class JwtTokensRepository {
  constructor(
    @InjectModel(JwtTokens.name)
    private JwtTokenModel: Model<JwtTokensDocument>,
  ) {}
  async getJwtByDeviceId(deviceId: string) {
    const deviceIdObject = new ObjectId(deviceId);
    return await this.JwtTokenModel.findOne({ deviceId: deviceIdObject });
  }
  async getJwtByDeviceName(deviceName: string) {
    return await this.JwtTokenModel.findOne({ deviceName });
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
  async save(token: JwtTokensDocument): Promise<boolean> {
    return token
      .save()
      .then((savedDoc) => {
        return savedDoc === token;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  async delete(token: JwtTokensDocument): Promise<boolean> {
    return token
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === token;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
}
