import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'The name of the role' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: {
      UsersController: ['create:user', 'read:user'],
      RolesController: ['create:role', 'read:role'],
    },
    description: 'Permissions for the role, organized by controller',
    type: Object,
    additionalProperties: { type: 'array', items: { type: 'string' } },
  })
  @IsObject()
  readonly permissions: {
    [controller: string]: string[];
  };
}

export class UpdateRoleDto {
  @ApiProperty({
    example: 'admin',
    description: 'The name of the role',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: {
      UsersController: ['create:user', 'read:user'],
      RolesController: ['create:role', 'read:role'],
    },
    description: 'Permissions for the role, organized by controller',
    type: Object,
    additionalProperties: { type: 'array', items: { type: 'string' } },
    required: false,
  })
  @IsOptional()
  @IsObject()
  readonly permissions?: {
    [controller: string]: string[];
  };
}
