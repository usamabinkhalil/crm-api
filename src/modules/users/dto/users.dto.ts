import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: false,
    description: 'Email verification status of the user',
    required: false,
  })
  @IsBoolean()
  readonly emailVerified?: boolean;

  @ApiProperty({
    example: ['604c8b2f9b1f8a35f8bda7f2'],
    description: 'Array of role IDs',
    required: false,
  })
  @IsArray()
  readonly roles?: Types.ObjectId[];
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user',
    required: false,
  })
  @IsString()
  readonly username?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: false,
  })
  @IsString()
  readonly password?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    example: false,
    description: 'Email verification status of the user',
    required: false,
  })
  @IsBoolean()
  readonly emailVerified?: boolean;

  @ApiProperty({
    example: ['604c8b2f9b1f8a35f8bda7f2'],
    description: 'Array of role IDs',
    required: false,
  })
  @IsArray()
  readonly roles?: Types.ObjectId[];
}
