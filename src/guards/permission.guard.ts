import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleAssignService } from 'src/api/shared/userRoleAssign/services/user.role.assign.service';
import {
  PermissionType,
  ServerPermission,
} from 'src/globals/enums/application.permission.enum';
import { RoleMmbership, UserType } from 'src/globals/enums/global.enum';
import {
  hasProjectAndUserPermissionForResource,
  hasUserPermissionForNoneResoruce,
} from 'src/globals/helper/permission.helper';
import { RequestUser } from 'src/globals/interfaces/global.interface';

export const Permissions = (
  permission: ServerPermission,
  ignoreResource?: boolean,
) => SetMetadata('permissions', { permission, ignoreResource });

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userRoleAssignService: UserRoleAssignService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get user and resource from request
    const { user } = context.switchToHttp().getRequest();
    const reqUser = user as RequestUser;
    const { resource } = context.switchToHttp().getRequest().headers;

    // get permission and ignoreResource from permission decorator
    const permissionDecoratorData = this.reflector.get<{
      permission: ServerPermission;
      ignoreResource: boolean;
    }>('permissions', context.getHandler());

    // check permission decorator is applied
    if (permissionDecoratorData == null) {
      return false;
    }

    const { permission, ignoreResource = false } = permissionDecoratorData;

    // check if permission and user exist
    if (permission == null || reqUser == null) {
      return false;
    }

    // check when resource is required but not provided in request
    if (!ignoreResource && resource == null) {
      return false;
    }

    // get all permissions for the user
    const permissions =
      await this.userRoleAssignService.getUserPermissionsForAllResources({
        userID: user._id,
        permissionType: PermissionType.APP_SERVER,
        userType: UserType.USER,
        forResource: ignoreResource ? null : resource,
        membership: !ignoreResource ? null : RoleMmbership.NONE_RESOURCE,
      });

    if (!ignoreResource && resource != null) {
      // check if user and project has the required permission
      return hasProjectAndUserPermissionForResource({
        user: reqUser,
        permission: permission,
        resourcePermissions: permissions,
      });
    } else {
      // check if user has the required permission
      return hasUserPermissionForNoneResoruce({
        user: reqUser,
        permission: permission,
        resourcePermissions: permissions,
      });
    }
  }
}
