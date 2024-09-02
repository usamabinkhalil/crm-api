import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema({ _id: false })
class SmsSetting {
  @Prop()
  key: string;

  @Prop()
  condition: string;

  @Prop()
  content: string;
}

const SmsSettingSchema = SchemaFactory.createForClass(SmsSetting);

@Schema({ _id: false })
class CallTransferSettings {
  @Prop()
  key: string;

  @Prop()
  condition: string;

  @Prop()
  number: string;
}

const CallTransferSettingsSchema =
  SchemaFactory.createForClass(CallTransferSettings);

@Schema({ _id: false })
class InformationExtractor {
  @Prop()
  key: string;

  @Prop()
  condition: string;

  @Prop()
  identifier: string;
}

const InformationExtractorSchema =
  SchemaFactory.createForClass(InformationExtractor);

@Schema()
export class Assistant extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop({
    type: String,
    enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    default: 'alloy',
  })
  voice: string;

  @Prop()
  language: string;

  @Prop()
  recording: boolean;

  @Prop()
  customGreeting: string;

  @Prop()
  prompt: string;

  @Prop()
  isActive: boolean;

  @Prop()
  number: string;

  @Prop()
  isValidNumber: boolean;

  @Prop()
  voiceUrl: string;

  @Prop()
  voiceFallbackUrl: string;

  @Prop()
  statusCallback: string;

  @Prop()
  openaiAssistant: string;

  @Prop({ type: [SmsSettingSchema], default: [] })
  smsSettings: SmsSetting[];

  @Prop({ type: [CallTransferSettingsSchema], default: [] })
  callTransferSettings: CallTransferSettings[];

  @Prop({ type: [InformationExtractorSchema], default: [] })
  informationExtractor: InformationExtractor[];
}

export const AssistantSchema = SchemaFactory.createForClass(Assistant);

AssistantSchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
