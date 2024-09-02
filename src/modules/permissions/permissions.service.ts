import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector, MetadataScanner } from '@nestjs/core';

@Injectable()
export class PermissionsService implements OnModuleInit {
  private allPermissions: any = {};
  // private allPermissions: string[] = [];
  private readonly logger = new Logger(PermissionsService.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    this.scanPermissions();
  }
  private scanPermissions() {
    const controllers = this.discoveryService.getControllers();

    controllers.forEach((wrapper) => {
      const { instance, name } = wrapper;
      if (!instance) return;
      const MethodNames = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance),
      );
      MethodNames.forEach((methodName: string) => {
        const permissions = this.reflector.get<string[]>(
          'permissions',
          instance[methodName],
        );
        if (permissions) {
          if (this.allPermissions[name]) {
            this.allPermissions[name] = [
              ...new Set([...this.allPermissions[name], ...permissions]),
            ];
          } else {
            this.allPermissions[name] = [...permissions];
          }
        }
      });
    });
  }

  public getAllPermissions(): any {
    return this.allPermissions;
  }
}
