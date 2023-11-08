import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerPermission } from 'src/globals/enums/application.permission.enum';
import { checkIfRequiredPermissionExists } from 'src/globals/helper/permission.helper';
import { RequestUser } from 'src/globals/interfaces/global.interface';

export const PermissionGuard = (
  requiredPermissions: ServerPermission[],
): any => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext) {
      const { user } = context.switchToHttp().getRequest();

      const reqUser = user as RequestUser;

      if (!reqUser) {
        throw new BadRequestException();
      }

      // get resource from header
      const { resource } = context.switchToHttp().getRequest().headers;

      if (!resource) {
        throw new BadRequestException('invalid request');
      }

      reqUser.resource = resource;

      // TODO studio permissions !!
      if (reqUser.studioPermissions != null) {
        // filter all permissions with resource id matching the requested resource
        const studioPermissions = reqUser.studioPermissions.filter((obj) => {
          return obj.resource.toString() === reqUser.resource.toString();
        });

        if (!studioPermissions || studioPermissions?.length == 0) {
          throw new ForbiddenException();
        }

        // check if the studio has the required permission
        const access = checkIfRequiredPermissionExists({
          resourcePermissions: studioPermissions,
          requiredPermission: requiredPermissions[0],
        });

        if (!access) {
          return false;
        }
      }

      // filter all userpermissions with resource id matching the requested resource
      const userPermissions = reqUser.permissions.filter((obj) => {
        return obj.resource.toString() === reqUser.resource.toString();
      });

      if (!userPermissions || userPermissions?.length == 0) {
        throw new ForbiddenException();
      }

      // check if the user has the required permission
      const access = checkIfRequiredPermissionExists({
        resourcePermissions: userPermissions,
        requiredPermission: requiredPermissions[0],
      });

      if (access == null) {
        return false;
      }

      return access;
    }
  }

  const guard = mixin(RoleGuardMixin);
  return guard;
};
