import { Module } from '@nestjs/common';
import { CallLogsService } from './call-logs.service';
import { CallLogsController } from './call-logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CallLog, CallLogSchema } from 'src/schemas/call-log.schema';
import { RolesModule } from '../roles/roles.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: CallLog.name, schema: CallLogSchema }]),
    RolesModule,
  ],
  controllers: [CallLogsController],
  providers: [CallLogsService],
  exports: [CallLogsService],
})
export class CallLogsModule {}
