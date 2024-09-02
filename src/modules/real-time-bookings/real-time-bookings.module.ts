import { Module } from '@nestjs/common';
import { RealTimeBookingsService } from './real-time-bookings.service';
import { RealTimeBookingsController } from './real-time-bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from '../roles/roles.module';
import {
  RealTimeBooking,
  RealTimeBookingSchema,
} from 'src/schemas/real-time-booking.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RealTimeBooking.name, schema: RealTimeBookingSchema },
    ]),
    RolesModule,
    HttpModule,
  ],
  controllers: [RealTimeBookingsController],
  providers: [RealTimeBookingsService],
  exports: [RealTimeBookingsService],
})
export class RealTimeBookingsModule {}
