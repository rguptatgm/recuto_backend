import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAccountDocument = UserAccount & Document;

@Schema({})
export class UserAccount {
  @Prop()
  kind: string;

  @Prop({ required: false })
  socialUid?: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: false })
  verifyToken?: string;

  @Prop({ required: false, default: false })
  verified: boolean;
}

export const UserAccountSchema = SchemaFactory.createForClass(UserAccount);
