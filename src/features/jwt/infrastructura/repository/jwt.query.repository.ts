import { ObjectId } from 'mongodb';
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
  async getJwtByDeviceId(deviceId: string) {
    const deviceIdObject = new ObjectId(deviceId);
    console.log(deviceIdObject);
    return await this.JwtTokenModel.find({ deviceId: deviceIdObject });
  }
  async dropJwts() {
    return this.JwtTokenModel.deleteMany({});
  }
}
