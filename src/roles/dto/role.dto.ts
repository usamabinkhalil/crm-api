// src/roles/dto/role.dto.ts
import { IsString, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  readonly name: string;

  @IsArray()
  readonly permissions: string[];
}

export class UpdateRoleDto {
  @IsString()
  readonly name?: string;

  @IsArray()
  readonly permissions?: string[];
}
