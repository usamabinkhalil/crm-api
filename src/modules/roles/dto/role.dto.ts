import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'The name of the role' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: ['create:user', 'read:user'],
    description: 'Permissions for the role',
  })
  @IsArray()
  readonly permissions: string[];
}

export class UpdateRoleDto {
  @ApiProperty({
    example: 'admin',
    description: 'The name of the role',
    required: false,
  })
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: ['create:user', 'read:user'],
    description: 'Permissions for the role',
    required: false,
  })
  @IsArray()
  readonly permissions?: string[];
}
