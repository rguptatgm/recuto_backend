import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { GenericCrudService } from "src/globals/services/generic.crud.service";
import { QuestionDocument, Question } from "src/schemas/question/question.schema";


@Injectable()
export class QuestionService extends GenericCrudService<QuestionDocument> {
    constructor(
        @InjectModel(Question.name)
        readonly question: Model<QuestionDocument>,
    ){
        super(question);
    }

}