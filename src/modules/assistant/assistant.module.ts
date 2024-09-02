import { forwardRef, Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { Assistant, AssistantSchema } from 'src/schemas/assistant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from '../roles/roles.module';
import { TwilioModule } from '../twilio/twilio.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assistant.name, schema: AssistantSchema },
    ]),
    RolesModule,
    forwardRef(() => TwilioModule),
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
