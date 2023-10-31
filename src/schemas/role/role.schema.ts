import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RoleAlias } from 'src/globals/enums/global.enum';
import { Permission } from '../permission/permission.schema';
import { System, SystemSchema } from '../system.schema';

export type RoleDocument = Role & Document;

export class RoleProjection {
  private static getDefaultProjection() {
    return {
      alias: 1,
      title: 1,
      description: 1,
      permissions: 1,
      system: 1,
    };
  }

  static DEFAULT(): any {
    return {
      ...this.getDefaultProjection(),
    };
  }
}

export class RolePopulate {} // TODO

@Schema({
  timestamps: { createdAt: 'system.createdAt', updatedAt: 'system.modifiedAt' },
})
export class Role {
  @Prop()
  title: string;

  @Prop({ enum: RoleAlias })
  alias: RoleAlias;

  @Prop({ required: false })
  description?: string;

  @Prop([
    {
      type: [MongooseSchema.Types.ObjectId],
      ref: 'Permission',
    },
  ])
  permissions: Permission[];

  @Prop({ type: SystemSchema, required: false })
  system?: System;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
