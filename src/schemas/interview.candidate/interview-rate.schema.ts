import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InterviewRateDocument = Document & {
  interviewId: string;
  videoId: string;
  rating: number;
  reviewer: string;
};

@Schema()
export class InterviewRate {
  @Prop({ required: true })
  interviewId: string;

  @Prop({ required: true })
  videoId: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  reviewer: string;
}

export const InterviewRateSchema = SchemaFactory.createForClass(InterviewRate);
