import { ResourcePermission } from '../interfaces/global.interface';

// check if the required permission exists in one of the provided resourcePermissions
export const checkIfRequiredPermissionExists = (args: {
  resourcePermissions: ResourcePermission[];
  requiredPermission: string;
}): boolean => {
  try {
    for (const tokenRole of args.resourcePermissions) {
      if (tokenRole.permissions.includes(args.requiredPermission)) {
        return true;
      }
    }

    return false;
  } catch (_) {
    return false;
  }
};
