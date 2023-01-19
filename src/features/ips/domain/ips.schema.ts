import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlockIpsDocument = HydratedDocument<BlockIps>;

@Schema({ timestamps: true })
export class BlockIps {
  @Prop()
  private ip: string;

  @Prop()
  private path: string;

  @Prop()
  private date: number;

  getIp() {
    return this.ip;
  }
  getPath() {
    return this.path;
  }
  getDate() {
    return this.date;
  }

  setIp(ip: string) {
    this.ip = ip;
  }
  setPath(path: string) {
    this.path = path;
  }
  setDate(date: number) {
    this.date = date;
  }
}

export const BlockIpsSchema = SchemaFactory.createForClass(BlockIps);
//get
BlockIpsSchema.methods.getIp = BlockIps.prototype.getIp;
BlockIpsSchema.methods.getPath = BlockIps.prototype.getPath;
BlockIpsSchema.methods.getDate = BlockIps.prototype.getDate;

//set
BlockIpsSchema.methods.setIp = BlockIps.prototype.setIp;
BlockIpsSchema.methods.setPath = BlockIps.prototype.setPath;
BlockIpsSchema.methods.setDate = BlockIps.prototype.setDate;
