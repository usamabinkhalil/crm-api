import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(RolesService) private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userPermissions = await this.rolesService.getRolePermissions(
      user.roles,
    );
    const controller = context.getClass().name;
    return requiredPermissions.every((permission) =>
      userPermissions[controller].some(
        (userPermission) => userPermission === permission,
      ),
    );
  }
}
