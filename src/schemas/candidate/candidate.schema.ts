import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SystemSchema, System } from "../system.schema";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Organization } from "../organization/organization.schema";
import { Interview } from '../interview/interview.schema';

export type CandidateDocument = Candidate & Document;

export class CandidateProtection{
    private static getDefaultProtection() {
        return {
            firstName: 1,
            lastName: 1,
            email: 1,
            dateOfBirth: 1,
            interviewId: 1,
            organizationId: 1,
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
export class Candidate {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ 
        type: MongooseSchema.Types.ObjectId,
        ref: 'Interview',
    })
    interviewID: Interview;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Organization',
    })
    organizationID: Organization;

    @Prop({type:SystemSchema,required: false})
    system?:System;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
