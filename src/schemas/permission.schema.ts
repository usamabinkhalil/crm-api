import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema()
export class Permission extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
