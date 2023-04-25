import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlockIps, BlockIpsDocument } from '../domain/ips.schema';
import { Repository } from '../../../common/common-repository-types';

@Injectable()
export class BlockIpsRepository extends Repository<BlockIpsDocument> {
  constructor(
    @InjectModel(BlockIps.name)
    private BlockIpsModel: Model<BlockIpsDocument>,
  ) {
    super();
  }
  async dropIps() {
    console.log('drop ips repo every 10 mins');
    return this.BlockIpsModel.deleteMany({});
  }
}
