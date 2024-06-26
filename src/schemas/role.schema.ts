// schemas/role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: [] })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
