import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  private permissions: string[] = [
    'create:role',
    'read:roles',
    'read:role',
    'update:role',
    'delete:role',
    'create:user',
    'read:users',
    'read:user',
    'update:user',
    'delete:user',
  ];

  constructor() {}

  public getAllPermissions(): string[] {
    return this.permissions;
  }
}
