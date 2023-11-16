import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from '../role/role.schema';
import { System, SystemSchema } from '../system.schema';
import { Project, ProjectProtection } from '../project/project.schema';
import { UserType } from 'src/globals/enums/global.enum';

export type InvitationDocument = Invitation & Document;

export class InvitationProtection {
  private static getDefaultProtection() {
    return {
      resource: 1,
      email: 1,
      role: 1,
      system: 1,
    };
  }

  static DEFAULT(): any {
    return {
      ...this.getDefaultProtection(),
    };
  }
}

export class InvitationPopulate {
  static DEFAULT(): any {
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
export class Invitation {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Project',
  })
  resource: Project;

  @Prop()
  email: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Role',
  })
  role: Role;

  @Prop({ enum: UserType, default: UserType.USER })
  type: UserType;

  @Prop({ type: SystemSchema, required: false })
  system?: System;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
