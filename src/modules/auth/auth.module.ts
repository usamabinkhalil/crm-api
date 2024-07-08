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

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    EmailModule,
    PassportModule,
    UsersModule,
    RolesModule,
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
