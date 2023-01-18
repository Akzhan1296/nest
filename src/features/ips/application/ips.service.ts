import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockIps, BlockIpsDocument } from '../domain/ips.schema';
import { BlockIpsRepository } from '../infrastructure/ips.repository';
import { IpsDataDto } from './dto/ips.dto';

@Injectable()
export class BlockIpsService {
  constructor(
    @InjectModel(BlockIps.name)
    private BlockIpsModel: Model<BlockIpsDocument>,
    protected blockIpsRepository: BlockIpsRepository,
  ) {}

  async addIpData(ipsData: IpsDataDto): Promise<boolean> {
    const ipData = new this.BlockIpsModel();
    ipData.setDate(ipsData.date);
    ipData.setIp(ipsData.ip);
    ipData.setPath(ipsData.path);
    return this.blockIpsRepository.save(ipData);
  }
}
