// src/schemas/base.schema.ts
import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class BaseSchema extends Document {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: { type: Types.ObjectId, ref: 'User' } })
  createdBy: Types.ObjectId;

  @Prop({ type: { type: Types.ObjectId, ref: 'User' } })
  updatedBy: Types.ObjectId;
}
