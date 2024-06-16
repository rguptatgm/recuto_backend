import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SystemSchema, System } from "../system.schema";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Organization } from "../organization/organization.schema";
import { Interview } from '../interview/interview.schema';
import { Question } from '../question/question.schema';
import { Candidate } from '../candidate/candidate.schema';

export type AnswerDocument = Answer & Document;

export class AnswerProtection{
    private static getDefaultProtection() {
        return {
            videoUrl: 1,
            comment: 1,
            rating: 1,
            candidateId: 1,
            organizationId: 1,
            interviewQuestionId: 1,
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
export class Answer {
    @Prop({ required: true })
    videoUrl: string;

    @Prop({ required: false })
    comment: string;

    @Prop({ required: false})
    rating: number;

    @Prop({ 
        type: MongooseSchema.Types.ObjectId,
        ref: 'Interview',
    })
    candidateID: Candidate;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Organization',
    })
    organizationID: Organization;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Question',
    })
    interviewQuestionID: Question;

    @Prop({type:SystemSchema,required: false})
    system?:System;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
