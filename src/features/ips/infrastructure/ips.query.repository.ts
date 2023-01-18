import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlockIps, BlockIpsDocument } from '../domain/ips.schema';

@Injectable()
export class BlockIpsQueryRepository {
  constructor(
    @InjectModel(BlockIps.name)
    private BlockIpsModel: Model<BlockIpsDocument>,
  ) {}
  async findIp(ip: string, path: string, dateLeft: number, dateRight: number) {
    const result = await this.BlockIpsModel.find({
      ip,
      path,
      date: { $gte: dateLeft, $lte: dateRight },
    }).lean();
    return result;
  }
  async dropIps() {
    return this.BlockIpsModel.deleteMany({});
  }
}
