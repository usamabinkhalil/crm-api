import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Role } from './role.schema';

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  systemAdmin: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ fullname: 'text', email: 'text' });

UserSchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
