// // auth/roles.guard.ts
// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     console.log('-------------------');
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     console.log('-------------------');
//     console.log(requiredRoles);

//     if (!requiredRoles) {
//       return true;
//     }
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user) {
//       throw new UnauthorizedException('User not authenticated');
//     }

//     const hasRole = () =>
//       user.roles.some((role) => requiredRoles.includes(role.name));
//     if (!hasRole()) {
//       throw new UnauthorizedException('User does not have the required roles');
//     }

//     return true;
//   }
// }

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
      user.role,
    );
    console.log(requiredPermissions);
    console.log(userPermissions);

    return requiredPermissions.every((permission) =>
      userPermissions.some(
        (userPermission) => userPermission.name === permission,
      ),
    );
  }
}
