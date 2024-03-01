import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { SystemSchema, System } from "../system.schema";
import { Document, Schema as MongooseSchema } from 'mongoose';

export type QuestionDocument = Question & Document;

export class QuestionProtection{
    private static getDefaultProtection() {
        return {
          title: 1,
          fullQuestion: 1,
          type:1,
          videoUrl:1,
          thinkingTime: 1,
          maxAnswerTime: 1,
          maxRetakes: 1,
          sort:1,
          interviewID:1,
          organizationID:1,
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
  export class Question {
    @Prop()
    title: string;

    @Prop()
    fullQuestion: string;

    @Prop()
    type: string;

    @Prop()
    videoUrl: string;

    @Prop()
    thinkingTime: number;

    @Prop()
    maxAnswerTime: number;

    @Prop()
    maxRetakes: number;

    @Prop()
    sort: number;

    //@Prop()
    //interviewID: TODO;

    //@Prop()
    //organizationID: TODO;
  
    @Prop({ type: SystemSchema, required: false })
    system?: System;
  }

  export const QuestionSchema = SchemaFactory.createForClass(Question);