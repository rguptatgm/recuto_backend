import BaseParticipantDto from './base.participant.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

export class UpdateParticipantDto extends BaseParticipantDto {
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  firstName: string;

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  lastName: string;

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  email: string;

  @IsOptional()
  @ApiPropertyOptional({ type: String, format: 'date' })
  dateOfBirth: Date;

  @IsOptional()
  @ApiPropertyOptional({ type: ObjectId })
  interviewId: ObjectId;

  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  videoUrls?: string[];
}
