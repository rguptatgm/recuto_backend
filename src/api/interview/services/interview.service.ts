import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { GenericCrudService } from "src/globals/services/generic.crud.service";
import { Interview, InterviewDocument } from "src/schemas/interview/interview.schema";


@Injectable()
export class InterviewService extends GenericCrudService<InterviewDocument> {
    constructor(
        @InjectModel(Interview.name)
        readonly interview: Model<InterviewDocument>,
    ){
        super(interview);
    }

}