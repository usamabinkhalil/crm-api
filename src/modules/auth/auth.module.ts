import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { EmailModule } from 'src/modules/email/email.module';
import { AuthController } from './auth.controller';
import { RolesGuard } from './roles.guard';
import { RolesModule } from 'src/modules/roles/roles.module';
import { GoogleCalendarService } from './google-calendar.service';
import { AssistantModule } from '../assistant/assistant.module';
import { CallLogsModule } from '../call-logs/call-logs.module';
import { RealTimeBookingsModule } from '../real-time-bookings/real-time-bookings.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    EmailModule,
    PassportModule,
    UsersModule,
    AssistantModule,
    CallLogsModule,
    RolesModule,
    RealTimeBookingsModule,
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, GoogleCalendarService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
