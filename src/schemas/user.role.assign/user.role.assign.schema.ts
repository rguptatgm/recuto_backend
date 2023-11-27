import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { System, SystemSchema } from '../system.schema';
import { RoleMmbership, UserType } from 'src/globals/enums/global.enum';
import { Role } from '../role/role.schema';
import { User } from '../user/user.schema';
import { Project, ProjectProtection } from '../project/project.schema';

export type UserRoleAssignDocument = UserRoleAssign & Document;

export class UserRoleAssignProtection {
  private static getDefaultProtection() {
    return {
      resource: 1,
      role: 1,
      validFrom: 1,
      validUntil: 1,
      membership: 1,
      type: 1,
    };
  }

  static DEFAULT(): any {
    return {
      ...this.getDefaultProtection(),
      user: 1,
      system: 1,
    };
  }

  static GET_RESOURCE(): any {
    return {
      resource: 1,
    };
  }
}

export class UserRoleAssignPopulate {
  static DEFAULT() {
    return [
      {
        path: 'resource',
        select: ProjectProtection.DEFAULT(),
      },
      {
        path: 'role',
        select: ProjectProtection.DEFAULT(),
      },
    ];
  }

  static GET_RESOURCE() {
    return [
      {
        path: 'resource',
        select: ProjectProtection.DEFAULT(),
      },
    ];
  }
}

@Schema({
  timestamps: { createdAt: 'system.createdAt', updatedAt: 'system.modifiedAt' },
})
export class UserRoleAssign {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Project',
    required: false,
  })
  resource?: Project;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user?: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Role',
  })
  role: Role;

  @Prop()
  validFrom: Date;

  @Prop()
  validUntil: Date;

  @Prop({ enum: RoleMmbership, default: RoleMmbership.USER })
  membership: RoleMmbership;

  @Prop({ enum: UserType, default: UserType.USER })
  type: UserType;

  @Prop({ type: SystemSchema, required: false })
  system?: System;
}

export const UserRoleAssignSchema =
  SchemaFactory.createForClass(UserRoleAssign);
