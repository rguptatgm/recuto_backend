import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PipelineStage } from 'mongoose';
import { PermissionType } from 'src/globals/enums/application.permission.enum';
import { RoleMmbership, UserType } from 'src/globals/enums/global.enum';
import { getResourceUserFieldBasedOnUserType } from 'src/globals/helper/resource.helper';

@Injectable()
export class UserRoleAssignAggregationQueryService {
  buildPiplineForGetUserPermissions = (args: {
    userID: string;
    forResource?: string;
    forPermissionType?: PermissionType;
    forMembership?: RoleMmbership;
    considerValidFromUntil?: boolean;
    userType: UserType;
  }): PipelineStage[] => {
    //
    let query: any[] = [];

    // The seperate querys are needed because if the membership is PLAN based, then the user will be null
    // And if no membership is provided, both types will be queried and this can only be done with the $or operator
    const roleUserQuery = [];
    const roleMembershipQuery = [];

    // add user condition to query depending on user type
    const field = getResourceUserFieldBasedOnUserType({
      userType: args.userType,
    });

    roleUserQuery.push({ [field]: new ObjectId(args.userID) });
    roleMembershipQuery.push({ [field]: null });

    // if a specific resource is provided, add resource condition to query
    if (args.forResource != null) {
      roleUserQuery.push({ resource: new ObjectId(args.forResource) });
      roleMembershipQuery.push({
        resource: new ObjectId(args.forResource),
      });
    }

    // if considerValidFromUntil is not provided or is false, add validFrom and validUntil condition to query
    if (args.considerValidFromUntil == null || args.considerValidFromUntil) {
      roleUserQuery.push(
        ...[
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
      );

      roleMembershipQuery.push(
        ...[
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
      );
    }

    // if a specific membership is provided, add membership condition to query
    if (args.forMembership != null) {
      roleUserQuery.push({
        membership: args.forMembership,
      });

      roleMembershipQuery.push({
        membership: args.forMembership,
      });
    }

    const userRoleAssignQuery = {
      $or: [
        {
          $and: roleUserQuery,
        },
        {
          $and: roleMembershipQuery,
        },
      ],
    };

    // get permissions from all types
    if (!args.forPermissionType) {
      query = [
        {
          $match: { type: args.userType },
        },
        {
          $match: { ...userRoleAssignQuery },
        },

        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
          },
        },

        {
          $unwind: '$role',
        },

        {
          $addFields: {
            roleAlias: '$role.alias',
          },
        },

        {
          $lookup: {
            from: 'permissions',
            localField: 'role.permissions',
            foreignField: '_id',
            as: 'permission_lookup',
          },
        },

        {
          $project: {
            roleAlias: 1,
            resource: 1,
            validFrom: 1,
            validUntil: 1,
            membership: 1,
            permissions: '$permission_lookup.alias',
          },
        },
      ];
      //get permissions of type server or type client
    } else {
      query = [
        {
          $match: { type: args.userType },
        },

        {
          $match: { ...userRoleAssignQuery },
        },

        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
          },
        },

        {
          $unwind: '$role',
        },

        {
          $addFields: {
            roleAlias: '$role.alias',
          },
        },

        {
          $lookup: {
            from: 'permissions',
            let: {
              type: args.forPermissionType,
              permissionIds: '$role.permissions',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ['$_id', '$$permissionIds'] },
                      { $eq: ['$type', '$$type'] },
                    ],
                  },
                },
              },
              { $project: { alias: 1 } },
            ],
            as: 'permissions',
          },
        },

        {
          $addFields: {
            permissions: '$permissions.alias',
          },
        },

        {
          $project: {
            roleAlias: 1,
            resource: 1,
            validFrom: 1,
            validUntil: 1,
            permissions: 1,
            membership: 1,
          },
        },
      ];
    }

    return query;
  };
}
