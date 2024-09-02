import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema()
export class CallLog extends BaseSchema {
  @Prop()
  sid: string;

  @Prop()
  dateCreated: Date;

  @Prop()
  dateUpdated: Date;

  @Prop()
  parentCallSid: string;

  @Prop()
  accountSid: string;

  @Prop()
  to: string;

  @Prop()
  toFormatted: string;

  @Prop()
  from: string;

  @Prop()
  fromFormatted: string;

  @Prop()
  phoneNumberSid: string;

  @Prop()
  status: string;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  duration: string;

  @Prop()
  price: string;

  @Prop()
  priceUnit: string;

  @Prop()
  direction: string;

  @Prop()
  answeredBy: string;

  @Prop()
  apiVersion: string;

  @Prop()
  forwardedFrom: string;

  @Prop()
  groupSid: string;

  @Prop()
  callerName: string;

  @Prop()
  queueTime: string;

  @Prop()
  trunkSid: string;

  @Prop()
  uri: string;

  @Prop({
    type: Map,
    of: String,
  })
  subresourceUris: Record<string, string>;
}

export const CallLogSchema = SchemaFactory.createForClass(CallLog);

CallLogSchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
