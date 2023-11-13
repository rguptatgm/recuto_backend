import { ServerPermission } from '../enums/application.permission.enum';
import { RoleMmbership } from '../enums/global.enum';
import {
  RequestUser,
  ResourcePermission,
} from '../interfaces/global.interface';

// check if the user has the required permission for the resource and membership
export const checkIfRequiredPermissionExists = (args: {
  resourcePermissions: ResourcePermission[];
  requiredPermission: ServerPermission;
  requiredMembership?: RoleMmbership;
  requiredResource?: string;
}): boolean => {
  try {
    return args.resourcePermissions.some((tokenRole) => {
      const hasPermission = tokenRole.permissions.includes(
        args.requiredPermission,
      );
      // check if membership match
      const membershipMatch = args.requiredMembership
        ? tokenRole.membership === args.requiredMembership
        : true;

      // check if resource match
      const resourceMatch = args.requiredResource
        ? tokenRole.resource === args.requiredResource
        : true;

      return hasPermission && membershipMatch && resourceMatch;
    });
  } catch (_) {
    return false;
  }
};

export const hasUserPermissionForNoneResoruce = (args: {
  user: RequestUser;
  permission: ServerPermission;
  resourcePermissions: ResourcePermission[];
}): boolean => {
  const access = checkIfRequiredPermissionExists({
    resourcePermissions: args.resourcePermissions,
    requiredPermission: args.permission,
    requiredMembership: RoleMmbership.NONE_RESOURCE,
    requiredResource: args.user.resource,
  });
  console.log(JSON.stringify(args.resourcePermissions, null, 2));
  console.log('access: ', access);

  return access;
};

export const hasProjectAndUserPermissionForResource = (args: {
  user: RequestUser;
  permission: ServerPermission;
  resourcePermissions: ResourcePermission[];
}): boolean => {
  let access = checkIfRequiredPermissionExists({
    resourcePermissions: args.resourcePermissions,
    requiredPermission: args.permission,
    requiredMembership: RoleMmbership.PROJECT,
    requiredResource: args.user.resource,
  });

  if (!access) {
    return false;
  }

  access = checkIfRequiredPermissionExists({
    resourcePermissions: args.resourcePermissions,
    requiredPermission: args.permission,
    requiredMembership: RoleMmbership.USER,
    requiredResource: args.user.resource,
  });

  return access;
};
