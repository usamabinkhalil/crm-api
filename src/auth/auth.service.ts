// auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class AuthService {
  private readonly permissions: Set<string> = new Set();
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signup(
    username: string,
    password: string,
    email: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      username,
      password: hashedPassword,
      email,
    });

    const token = this.jwtService.sign({ userId: user._id });

    await this.emailService.sendMail(
      email,
      'Email Verification',
      `Please verify your email by clicking the following link: http://localhost:3000/auth/verify/${token}`,
    );

    return user;
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong credentials');
    }
    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.getUserById(payload.userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    user.emailVerified = true;
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const token = this.jwtService.sign({ userId: user._id });

    await this.emailService.sendMail(
      email,
      'Password Reset',
      `Please reset your password by clicking the following link: http://localhost:3000/auth/reset-password/${token}`,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.getUserById(payload.userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async refresh(refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.getUserById(payload.sub);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const newPayload = { username: user.username, sub: user._id };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1d',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
