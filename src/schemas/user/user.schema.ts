import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { System, SystemSchema } from '../system.schema';
import { Document } from 'mongoose';
import { UserAccount, UserAccountSchema } from './user.account.schema';

export type UserDocument = User & Document;

export class UserProtection {
  private static getDefaultProtection() {
    return {
      firstName: 1,
      lastName: 1,
      email: 1,
      setupCompleted: 1,
      dateOfBirth: 1,
    };
  }

  static DEFAULT(): any {
    return {
      ...this.getDefaultProtection(),
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

  @Prop({ required: false })
  dateOfBirth?: Date;

  @Prop({ type: [UserAccountSchema] })
  accounts: UserAccount[];

  @Prop({ required: false })
  deviceIdentifierID?: string;

  @Prop({ required: false, default: [] })
  fcmTokens?: string[];

  @Prop({ default: false })
  setupCompleted: boolean;

  @Prop({ type: SystemSchema, required: false })
  system?: System;
}

export const UserSchema = SchemaFactory.createForClass(User);
