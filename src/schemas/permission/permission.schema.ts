import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PermissionType } from 'src/globals/enums/application.permission.enum';
import { System, SystemSchema } from '../system.schema';

export type PermissionDocument = Permission & Document;

export class PermisionProjection {
  private static getDefaultProjection() {
    return {
      alias: 1,
      description: 1,
      type: 1,
      system: 1,
    };
  }

  static DEFAULT(): any {
    return {
      ...this.getDefaultProjection(),
    };
  }
}

@Schema({
  timestamps: { createdAt: 'system.createdAt', updatedAt: 'system.modifiedAt' },
})
export class Permission {
  @Prop()
  alias: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ enum: PermissionType, type: String })
  type: string;

  @Prop({ type: SystemSchema, required: false })
  system?: System;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
