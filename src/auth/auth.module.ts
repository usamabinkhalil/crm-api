import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { EmailModule } from 'src/email/email.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule, // Import UsersModule
    EmailModule,
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', // Use a proper secret key here
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
