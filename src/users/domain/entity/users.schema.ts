// schema

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop()
  private login: string;
  @Prop()
  private password: string;
  @Prop()
  private email: string;
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
    const length = password.length;
    if (length < 6 || length > 20) {
      throw new Error('password error length');
    }
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

  createUser(email: string, password: string, login: string) {
    this.setLogin(login);
    this.setEmail(email);
    this.setPassword(password);
  }
}

export const UsersSchema = SchemaFactory.createForClass(Users);
UsersSchema.methods.setLogin = Users.prototype.setLogin;
UsersSchema.methods.getLogin = Users.prototype.getLogin;
UsersSchema.methods.setPassword = Users.prototype.setPassword;
UsersSchema.methods.getPassword = Users.prototype.getPassword;
UsersSchema.methods.setEmail = Users.prototype.setEmail;
UsersSchema.methods.getEmail = Users.prototype.getEmail;
UsersSchema.methods.createUser = Users.prototype.createUser;
