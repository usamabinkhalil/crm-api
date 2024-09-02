import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import * as mongoose from 'mongoose';
import { Assistant } from './assistant.schema';

@Schema()
export class RealTimeBooking extends BaseSchema {
  @Prop()
  userId: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Assistant' })
  assistantId: Assistant;

  @Prop({
    type: {
      city: String,
      timezone: String,
      pop: Number,
    },
    _id: false,
  })
  timeZone: {
    city: string;
    timezone: string;
    pop: number;
  };

  @Prop()
  username: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  apiKey: string;

  @Prop()
  eventId: number;

  @Prop()
  sendConfirmationSMS: boolean;

  @Prop()
  confirmationSMS: string;
}

export const RealTimeBookingSchema =
  SchemaFactory.createForClass(RealTimeBooking);

RealTimeBookingSchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
