import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';
import { Candidate, CandidateDocument } from 'src/schemas/candidate/candidate.schema';
import { UpdateCandidateDto } from 'src/dtos/candidate/update.candidate.dto';

@Injectable()
export class CandidateService extends GenericCrudService<CandidateDocument> {
  constructor(
    @InjectModel(Candidate.name)
    readonly candidate: Model<CandidateDocument>,
  ) {
    super(candidate);
  }

  async create(data: any): Promise<CandidateDocument> {
    const { document } = data;
    return this.candidate.create(document);
  }

  async find(data: any): Promise<CandidateDocument[]> {
    const { conditions, projection } = data;
    return this.candidate.find(conditions, projection);
  }

  async update(candidateId: string, updateData: any): Promise<CandidateDocument | null> {
    return this.candidate.findByIdAndUpdate(candidateId, updateData, { new: true });
  }

  async updateByEmailAndInterviewId(updateParticipantDto: UpdateCandidateDto): Promise<CandidateDocument | null> {
    const { email, interviewID, ...updateData } = updateParticipantDto;
    console.log('Updating candidate with email:', email, 'and interviewId:', interviewID, 'with data:', updateData);
    return this.candidate.findOneAndUpdate({ email, interviewID }, updateData, { new: true });
  }
}
