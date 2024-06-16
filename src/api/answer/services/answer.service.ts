import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';

import { UpdateAnswerDto } from 'src/dtos/answer/update.answer.dto';
import { AnswerDocument, Answer } from 'src/schemas/answer/answer.schema';

@Injectable()
export class AnswerService extends GenericCrudService<AnswerDocument> {
  constructor(
    @InjectModel(Answer.name)
    readonly answer: Model<AnswerDocument>,
  ) {
    super(answer);
  }

  async create(data: any): Promise<AnswerDocument> {
    const { document } = data;
    return this.answer.create(document);
  }

  async find(data: any): Promise<AnswerDocument[]> {
    const { conditions, projection } = data;
    return this.answer.find(conditions, projection);
  }

  async update(answerId: string, updateData: any): Promise<AnswerDocument | null> {
    return this.answer.findByIdAndUpdate(answerId, updateData, { new: true });
  }

  async updateByQuestionId(updateParticipantDto: UpdateAnswerDto): Promise<AnswerDocument | null> {
    const { interviewQuestionID, ...updateData } = updateParticipantDto;
    console.log('Updating answer with email:', interviewQuestionID, 'with data:', updateData);
    return this.answer.findOneAndUpdate({ interviewQuestionID }, updateData, { new: true });
  }
}
