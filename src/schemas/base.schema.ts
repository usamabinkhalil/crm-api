// src/schemas/base.schema.ts
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class BaseSchema extends Document {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: User;
}
