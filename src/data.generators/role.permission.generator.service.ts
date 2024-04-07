import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/api/shared/permission/services/permission.service';
import { RoleService } from 'src/api/shared/role/services/role.service';
import {
  PermissionType,
  examplePlanClientPermission,
  examplePlanServerPermission,
  userClientPermission,
  userServerPermission,
  userServerPermissionNoneResource,
} from 'src/globals/enums/application.permission.enum';
import { RoleAlias } from 'src/globals/enums/global.enum';

@Injectable()
export class RolePermissionGeneratorService {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  // create default roles and permissions
  async createDefaultRoleAndPermissions(): Promise<void> {
    const generateRolesAndPermission = true; //! set true -> to create default roles and permissions

    // if any role or permission are in the collection return otherwise generate
    if (!generateRolesAndPermission) {
      console.log(
        ' -> set generateRolesAndPermission to true to check if roles and permissions up to date',
      );
      return;
    }

    //! USER
    await this.createRoleAndPermission({
      permission: userServerPermission,
      type: PermissionType.APP_SERVER,
      roleAlias: RoleAlias.APP_USER,
      title: 'App User',
    });

    await this.createRoleAndPermission({
      permission: userClientPermission,
      type: PermissionType.APP_CLIENT,
      roleAlias: RoleAlias.APP_USER,
      title: 'App User',
    });

    //! USER WITH NONE RESOURCE
    await this.createRoleAndPermission({
      permission: userServerPermissionNoneResource,
      type: PermissionType.APP_SERVER,
      roleAlias: RoleAlias.APP_USER_NONE_RESOURCE,
      title: 'App User None Resource',
    });

    //! BASIC PLAN

    await this.createRoleAndPermission({
      permission: examplePlanServerPermission,
      type: PermissionType.APP_SERVER,
      roleAlias: RoleAlias.EXAMPLE_PLAN,
      title: 'Basic Plan',
    });

    await this.createRoleAndPermission({
      permission: examplePlanClientPermission,
      type: PermissionType.APP_CLIENT,
      roleAlias: RoleAlias.EXAMPLE_PLAN,
      title: 'Basic Plan',
    });

    console.log('default roles and permissions successfully created');
  }

  private async createRoleAndPermission(args: {
    permission: any[];
    type: PermissionType | string;
    roleAlias: RoleAlias;
    title?: string;
  }): Promise<any> {
    let role = undefined;
    const createdRoles = [];
    const createdPermissions = [];
    const assignedPermissions = [];

    // check if role exists
    role = await this.roleService.findOne({
      conditions: { alias: args.roleAlias },
      projection: {
        permissions: 1,
        alias: 1,
        _id: 1,
        description: 1,
        title: 1,
      },
    });

    // if role dosent exists create
    if (!role) {
      role = this.roleService.create({
        document: {
          title: args.title ?? args.roleAlias,
          alias: args.roleAlias,
          description: 'auto generated role from server',
        },
      });

      createdRoles.push(role.alias);
    }

    for (let i = 0; i < args.permission.length; i++) {
      // check if permission exists
      const permissionExists = await this.permissionService.findOne({
        conditions: { alias: args.permission[i] },
      });

      if (!permissionExists) {
        const permission = await this.permissionService.create({
          document: {
            alias: args.permission[i],
            description: 'auto generated permission from server',
            type: args.type,
          },
        });

        await this.roleService.updateOne({
          conditions: { alias: args.roleAlias },
          changes: { $push: { permissions: permission._id } },
        });

        createdPermissions.push(permission.alias);
      } else {
        // check if the permissions are already assign to the role
        const permissionExistsInRole = await this.roleService.findOne({
          conditions: {
            alias: args.roleAlias,
            permissions: permissionExists._id,
          },
        });

        if (!permissionExistsInRole) {
          await this.roleService.updateOne({
            conditions: { alias: args.roleAlias },
            changes: { $push: { permissions: permissionExists._id } },
          });

          assignedPermissions.push(permissionExists.alias);
        }
      }
    }

    console.log(
      '********** ',
      args.roleAlias + ' -- ' + args.type.toString() + ' **********',
    );

    console.log('created roles count: ', createdRoles.length);
    if (createdRoles.length > 0) console.log('created roles: ', createdRoles);
    console.log('created permissions count: ', createdPermissions.length);
    if (createdPermissions.length > 0)
      console.log('created permissions: ', createdPermissions);
    console.log('assigned permissions count: ', assignedPermissions.length);
    if (assignedPermissions.length > 0)
      console.log('assigned permissions: ', assignedPermissions);
    console.log('-------------------------------------');
  }
}
