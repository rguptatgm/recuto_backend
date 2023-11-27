import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import {
  RoleAlias,
  RoleMmbership,
  UserType,
} from 'src/globals/enums/global.enum';
import { RoleService } from '../../role/services/role.service';
import {
  UserRoleAssign,
  UserRoleAssignDocument,
} from '../../../../schemas/user.role.assign/user.role.assign.schema';
import { UserRoleAssignAggregationQueryService } from './user.role.assign.aggregation.query.service';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';
import { PermissionType } from 'src/globals/enums/application.permission.enum';
import { getResourceUserFieldBasedOnUserType } from 'src/globals/helper/resource.helper';

@Injectable()
export class UserRoleAssignService extends GenericCrudService<UserRoleAssignDocument> {
  constructor(
    @InjectModel(UserRoleAssign.name)
    readonly userRoleAssign: Model<UserRoleAssignDocument>,
    private readonly queryService: UserRoleAssignAggregationQueryService,
    private readonly roleService: RoleService,
  ) {
    super(userRoleAssign);
  }

  // get active (consider validfrom and validUntil) user permissions for resource
  getUserPermissionsForAllResources = async (args: {
    userID: string;
    permissionType?: PermissionType;
    membership?: RoleMmbership;
    userType: UserType;
    forResource?: string;
  }): Promise<any[] | any> => {
    // build aggregation query
    const query = this.queryService.buildPiplineForGetUserPermissions({
      userID: args.userID,
      forPermissionType: args.permissionType,
      forMembership: args.membership,
      userType: args.userType,
      forResource: args.forResource,
    });

    return await this.userRoleAssign.aggregate(query);
  };

  assignProjectToPlan = async (args: {
    resource: string;
    role: RoleAlias;
    type: UserType;
    validUntil?: Date;
  }): Promise<any> => {
    // get role by alias
    const role = await this.roleService.findOne({
      conditions: { alias: args.role },
    });

    if (!role) {
      return;
    }

    // check if resource is already assigned to the role
    const resourceExists = await this.checkIfAssignedToResource({
      resource: args.resource,
      roleID: role._id,
      membership: RoleMmbership.PROJECT,
      userType: args.type != null ? args.type : UserType.USER,
    });

    // assign user to resource if not exists
    if (!resourceExists) {
      // set resource type based on user type

      const userRoleAssign: UserRoleAssign = {
        role: new ObjectId(role._id) as any,
        validFrom: new Date(),
        validUntil: !args.validUntil ? new Date('2222') : args.validUntil,
        membership: RoleMmbership.PROJECT,
        type: args.type != null ? args.type : UserType.USER,
        resource: new ObjectId(args.resource) as any,
      };

      return await this.create({ document: userRoleAssign });
    }
  };

  assignUserToRole = async (args: {
    userRole: RoleAlias;
    userID: string;
    resource?: string;
    userType: UserType;
    validUntil?: Date;
    membership?: RoleMmbership;
  }): Promise<any> => {
    // get role by alias
    const role = await this.roleService.findOne({
      conditions: { alias: args.userRole },
    });

    if (!role) {
      return;
    }

    // check if user is already assigned to the resource
    const resourceExists = await this.checkIfAssignedToResource({
      resource: args.resource,
      roleID: role._id,
      userID: args.userID,
      userType: args.userType,
    });

    // assign user to resource if not exists
    if (!resourceExists) {
      // set resource type based on user type

      const userRoleAssign: UserRoleAssign = {
        role: new ObjectId(role._id) as any,
        validFrom: new Date(),
        validUntil: !args.validUntil ? new Date('2222') : args.validUntil,
        membership: !args.membership ? RoleMmbership.USER : args.membership,
        type: args.userType,
      };

      if (args.resource) {
        userRoleAssign.resource = new ObjectId(args.resource) as any;
      }

      // add user condition to query depending on user type
      const field = getResourceUserFieldBasedOnUserType({
        userType: args.userType,
      });

      userRoleAssign[field] = new ObjectId(args.userID) as any;

      return await this.create({ document: userRoleAssign });
    }
  };

  // assign user to resource
  checkIfAssignedToResource = async (args: {
    userID?: string;
    resource?: string;
    roleID: string;
    userType: UserType;
    membership?: RoleMmbership;
  }) => {
    const query = [{ role: new ObjectId(args.roleID) }] as any[];

    // add resource condition to query if exists
    if (args.resource) {
      query.push({ resource: new ObjectId(args.resource) });
    }

    // add membership condition to query if exists
    if (args.membership) {
      query.push({ membership: args.membership });
    }

    if (args.userID) {
      // add user condition to query depending on user type
      const field = getResourceUserFieldBasedOnUserType({
        userType: args.userType,
      });

      query.push({ [field]: new ObjectId(args.userID) });
    }

    const resourceExists = await this.findOne({
      conditions: {
        $and: query,
      },
    });

    if (!resourceExists) {
      return false;
    }

    return true;
  };

  // returns array of projects for user
  getProjectsForUser = async (args: {
    user: any;
    userType: UserType;
  }): Promise<any[] | any> => {
    let userQuery = {} as any;

    // add user condition to query depending on user type
    const field = getResourceUserFieldBasedOnUserType({
      userType: args.userType,
    });

    userQuery = { [field]: new ObjectId(args.user._id) };

    const studios = await this.userRoleAssign.aggregate([
      {
        $match: {
          $and: [
            userQuery,
            {
              validFrom: {
                $lte: new Date(),
              },
            },
            {
              validUntil: {
                $gte: new Date(),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'resource',
          foreignField: '_id',
          as: 'resource',
          pipeline: [
            // {
            //   $project: UserType.DASHBOARD_USER // TODO
            //     ? StudioProtection.DASHBOARD()
            //     : StudioProtection.DEFAULT(),
            // },
          ],
        },
      },
      {
        $unwind: '$resource',
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ['$resource'] },
        },
      },
    ]);

    return studios;
  };
}
