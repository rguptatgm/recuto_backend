import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { System, SystemSchema } from '../system.schema';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export class UserProtection {
  private static getDefaultProtection() {
    return {
      firstName: 1,
      lastName: 1,
      email: 1,
    };
  }

  static DEFAULT(): any {
    return {
      ...this.getDefaultProtection(),
    };
  }

  static ADMIN(): any {
    return {
      ...this.getDefaultProtection(),
      system: 1,
    };
  }
}

export class UserPopulate {}

@Schema({
  timestamps: { createdAt: 'system.createdAt', updatedAt: 'system.modifiedAt' },
})
export class User {
  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop()
  email: string;

  @Prop({ type: SystemSchema, required: false })
  system?: System;
}

export const UserSchema = SchemaFactory.createForClass(User);
