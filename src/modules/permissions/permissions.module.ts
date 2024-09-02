import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { DiscoveryModule } from '@nestjs/core';
@Module({
  imports: [DiscoveryModule],
  providers: [PermissionsService],
  exports: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
