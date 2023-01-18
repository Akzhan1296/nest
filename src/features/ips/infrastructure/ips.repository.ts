import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlockIps, BlockIpsDocument } from '../domain/ips.schema';

@Injectable()
export class BlockIpsRepository {
  constructor(
    @InjectModel(BlockIps.name)
    private BlockIpsModel: Model<BlockIpsDocument>,
  ) {}
  async save(ipData: BlockIpsDocument): Promise<boolean> {
    return ipData
      .save()
      .then((savedDoc) => {
        return savedDoc === ipData;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  async delete(ipData: BlockIpsDocument): Promise<boolean> {
    return ipData
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === ipData;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
}
