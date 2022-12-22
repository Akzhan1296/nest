// schema

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CreateUserDTO } from '../../application/dto/users.dto';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop()
  private login: string;
  @Prop()
  private password: string;
  @Prop()
  private email: string;

  @Prop()
  private confirmCode: string;

  @Prop()
  private isConfirmed: boolean;

  @Prop()
  private emailExpirationDate: Date | null;
  @Prop()
  createdAt: Date;

  setLogin(login: string) {
    const length = login.length;
    if (length < 3 || length > 10) {
      throw new Error('login error length');
    }
    this.login = login;
  }
  getLogin() {
    return this.login;
  }
  setPassword(password: string) {
    this.password = password;
  }
  getPassword() {
    return this.password;
  }
  setEmail(email: string) {
    const reg = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    if (!reg.test(email)) {
      throw new Error('rex exp error');
    }
    this.email = email;
  }
  getEmail() {
    return this.email;
  }
  getConfirmCode() {
    return this.confirmCode;
  }
  getIsConfirmed() {
    return this.isConfirmed;
  }
  getEmailExpirationDate() {
    return this.emailExpirationDate;
  }
  setConfirmCode(confirmCode: string) {
    this.confirmCode = confirmCode;
  }
  setIsConfirmed(isConfirmed: boolean) {
    this.isConfirmed = isConfirmed;
  }
  setEmailExpirationDate(date: Date | null) {
    this.emailExpirationDate = date;
  }

  createUser(createUserData: CreateUserDTO) {
    this.setLogin(createUserData.login);
    this.setEmail(createUserData.email);
    this.setPassword(createUserData.password);
    this.setConfirmCode(createUserData.confirmCode);
    this.setIsConfirmed(createUserData.isConfirmed);
    this.setEmailExpirationDate(createUserData.emailExpirationDate);
  }
}

export const UsersSchema = SchemaFactory.createForClass(Users);
UsersSchema.methods.setLogin = Users.prototype.setLogin;
UsersSchema.methods.getLogin = Users.prototype.getLogin;
UsersSchema.methods.setPassword = Users.prototype.setPassword;
UsersSchema.methods.getPassword = Users.prototype.getPassword;
UsersSchema.methods.setEmail = Users.prototype.setEmail;
UsersSchema.methods.getEmail = Users.prototype.getEmail;
UsersSchema.methods.getConfirmCode = Users.prototype.getConfirmCode;
UsersSchema.methods.setConfirmCode = Users.prototype.setConfirmCode;
UsersSchema.methods.getIsConfirmed = Users.prototype.getIsConfirmed;
UsersSchema.methods.setIsConfirmed = Users.prototype.setIsConfirmed;
UsersSchema.methods.getEmailExpirationDate =
  Users.prototype.getEmailExpirationDate;
UsersSchema.methods.setEmailExpirationDate =
  Users.prototype.setEmailExpirationDate;
UsersSchema.methods.createUser = Users.prototype.createUser;
