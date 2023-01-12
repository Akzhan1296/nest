import { ObjectId } from 'mongodb';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JwtTokensDocument = HydratedDocument<JwtTokens>;

@Schema({ timestamps: true })
export class JwtTokens {
  @Prop()
  private email: string;

  @Prop()
  private login: string;

  @Prop()
  private userId: ObjectId;

  @Prop()
  private deviceIp: string;

  @Prop()
  private deviceId: ObjectId;

  @Prop()
  private deviceName: string;

  @Prop()
  private createdAt: Date;

  getUserId() {
    return this.userId;
  }
  getEmail() {
    return this.email;
  }
  getLogin() {
    return this.login;
  }
  getDeviceIp() {
    return this.deviceIp;
  }
  getDeviceId() {
    return this.deviceId;
  }
  getDeviceName() {
    return this.deviceName;
  }
  getCreatedAt() {
    return this.createdAt;
  }

  setUserId(userId: ObjectId) {
    this.userId = userId;
  }
  setEmail(email: string) {
    this.email = email;
  }
  setLogin(login: string) {
    this.login = login;
  }
  setDeviceIp(deviceIp: string) {
    this.deviceIp = deviceIp;
  }
  setDeviceId(deviceId: ObjectId) {
    this.deviceId = deviceId;
  }
  setDeviceName(deviceName: string) {
    this.deviceName = deviceName;
  }
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }
}

export const JwtSchema = SchemaFactory.createForClass(JwtTokens);
//get
JwtSchema.methods.getUserId = JwtTokens.prototype.getUserId;
JwtSchema.methods.getDeviceIp = JwtTokens.prototype.getDeviceIp;
JwtSchema.methods.getDeviceId = JwtTokens.prototype.getDeviceId;
JwtSchema.methods.getDeviceName = JwtTokens.prototype.getDeviceName;
JwtSchema.methods.getCreatedAt = JwtTokens.prototype.getCreatedAt;
JwtSchema.methods.getEmail = JwtTokens.prototype.getEmail;
JwtSchema.methods.getLogin = JwtTokens.prototype.getLogin;
//set
JwtSchema.methods.setUserId = JwtTokens.prototype.setUserId;
JwtSchema.methods.setDeviceIp = JwtTokens.prototype.setDeviceIp;
JwtSchema.methods.setDeviceId = JwtTokens.prototype.setDeviceId;
JwtSchema.methods.setDeviceName = JwtTokens.prototype.setDeviceName;
JwtSchema.methods.setCreatedAt = JwtTokens.prototype.setCreatedAt;
JwtSchema.methods.setLogin = JwtTokens.prototype.setLogin;
JwtSchema.methods.setEmail = JwtTokens.prototype.setEmail;
