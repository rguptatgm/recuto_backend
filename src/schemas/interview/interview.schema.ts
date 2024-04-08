import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { SystemSchema, System } from "../system.schema";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Organization } from "../organization/organization.schema";
import { ObjectId } from "mongodb";

export type InterviewDocument = Interview & Document;

export class InterviewProtection{
    private static getDefaultProtection() {
        return {
          title: 1,
          description: 1,
          organizationID: 1,
          system: 1,
        };
    }
    static DEFAULT(): any {
        return {
          ...this.getDefaultProtection(),
        };
    }
}


@Schema({
    timestamps: { createdAt: 'system.createdAt', updatedAt: 'system.modifiedAt' },
  })
  export class Interview {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({
      type: MongooseSchema.Types.ObjectId,
      ref: 'Organization',
    })
    organizationID: Organization;
  
    @Prop({ type: SystemSchema, required: false })
    system?: System;
  }

  export const InterviewSchema = SchemaFactory.createForClass(Interview);