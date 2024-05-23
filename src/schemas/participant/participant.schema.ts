import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema()
export class Participant {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true })
    interviewId: mongoose.Types.ObjectId;

    @Prop({ type: [String], default: [] })
    videoUrls?: string[]; // Neues optionales Feld für Video-URLs
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);

export enum ParticipantProtection {
    DEFAULT = '-__v'
}
