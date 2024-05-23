import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';
import { Participant, ParticipantDocument } from 'src/schemas/participant/participant.schema';
import { UpdateParticipantDto } from 'src/dtos/participant/update.participant.dto';

@Injectable()
export class ParticipantService extends GenericCrudService<ParticipantDocument> {
  constructor(
    @InjectModel(Participant.name)
    readonly participant: Model<ParticipantDocument>,
  ) {
    super(participant);
  }

  async create(data: any): Promise<ParticipantDocument> {
    const { document } = data;
    return this.participant.create(document);
  }

  async find(data: any): Promise<ParticipantDocument[]> {
    const { conditions, projection } = data;
    return this.participant.find(conditions, projection);
  }

  async update(participantId: string, updateData: any): Promise<ParticipantDocument | null> {
    return this.participant.findByIdAndUpdate(participantId, updateData, { new: true });
  }

  async updateByEmailAndInterviewId(updateParticipantDto: UpdateParticipantDto): Promise<ParticipantDocument | null> {
    const { email, interviewId, ...updateData } = updateParticipantDto;
    console.log('Updating participant with email:', email, 'and interviewId:', interviewId, 'with data:', updateData);
    return this.participant.findOneAndUpdate({ email, interviewId }, updateData, { new: true });
  }
}
