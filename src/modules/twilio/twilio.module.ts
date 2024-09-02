import { forwardRef, Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { TwilioController } from './twilio.controller';
import { AssistantModule } from '../assistant/assistant.module';
import { CallLogsModule } from '../call-logs/call-logs.module';

@Module({
  imports: [forwardRef(() => AssistantModule), CallLogsModule],
  providers: [TwilioService],
  exports: [TwilioService],
  controllers: [TwilioController],
})
export class TwilioModule {}
