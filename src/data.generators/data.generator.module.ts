import { Module } from '@nestjs/common';
import { PermissionModule } from 'src/api/shared/permission/permission.module';
import { RoleModule } from 'src/api/shared/role/role.module';
import { RolePermissionGeneratorService } from './role.permission.generator.service';

@Module({
  imports: [PermissionModule, RoleModule],
  providers: [RolePermissionGeneratorService],
  exports: [RolePermissionGeneratorService],
})
export class DataGeneratorModule {}
