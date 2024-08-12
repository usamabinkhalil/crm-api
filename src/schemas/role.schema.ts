import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema()
export class Role extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: String, ref: 'Permission' }] })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
