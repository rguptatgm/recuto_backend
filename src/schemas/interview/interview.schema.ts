import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { SystemSchema, System } from "../system.schema";
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InterviewDocument = Interview & Document;

export class InterviewProtection{
    private static getDefaultProtection() {
        return {
          title: 1,
          description: 1,
          thinkingTime: 1,
          maxAnswerTime: 1,
          maxRetakes: 1,
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

    @Prop()
    thinkingTime: number;

    @Prop()
    maxAnswerTime: number;

    @Prop()
    maxRetakes: number;

    //@Prop()
    //organizationID: TODO;
  
    @Prop({ type: SystemSchema, required: false })
    system?: System;
  }

  export const InterviewSchema = SchemaFactory.createForClass(Interview);