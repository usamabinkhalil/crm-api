// auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
  Redirect,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  UserDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from 'src/modules/auth/dto/auth.dto';
import { GoogleCalendarService } from './google-calendar.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: UserDto })
  @Post('signup')
  async signup(@Body() UserDto: UserDto) {
    const { fullname, username, password, email } = UserDto;
    return this.authService.signup(fullname, username, password, email);
  }

  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in.',
    schema: {
      example: {
        access_token: 'jwt-token',
        refresh_token: 'jwt-refresh-token',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully.',
    schema: {
      example: {
        access_token: 'jwt-token',
        refresh_token: 'jwt-refresh-token',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid token.' })
  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: ForgotPasswordDto })
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid token.' })
  @ApiBody({ type: ResetPasswordDto })
  @Patch('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Get('google')
  @Redirect()
  getAuthUrl() {
    const url = this.googleCalendarService.getAuthUrl();
    return { url };
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string) {
    const tokens = await this.googleCalendarService.getTokens(code);
    // Save tokens to user session or database
    return tokens;
  }
}
