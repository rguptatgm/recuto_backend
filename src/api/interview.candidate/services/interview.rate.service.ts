import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInterviewRateDto } from 'src/dtos/interviewRate/create.interview.rate.dto';
import { UpdateInterviewRateDto } from 'src/dtos/interviewRate/update.interview.rate.dto';
import { InterviewRate, InterviewRateDocument } from 'src/schemas/interview.candidate/interview-rate.schema';

@Injectable()
export class InterviewRateService {
  constructor(
    @InjectModel(InterviewRate.name) private interviewRateModel: Model<InterviewRateDocument>
  ) {}

  async addRating(interviewId: string, videoId: string, createInterviewRateDto: CreateInterviewRateDto): Promise<InterviewRate> {
    const newRating = new this.interviewRateModel({
      ...createInterviewRateDto,
      interviewId,
      videoId
    });
    return newRating.save();
  }

  async getRatings(interviewId: string, videoId: string): Promise<InterviewRate[]> {
    const ratings = await this.interviewRateModel.find({ interviewId, videoId }).exec();
    if (!ratings.length) {
      throw new NotFoundException('No ratings found.');
    }
    return ratings;
  }

  async updateRating(interviewId: string, videoId: string, ratingId: string, updateInterviewRateDto: UpdateInterviewRateDto): Promise<InterviewRate> {
    const updatedRating = await this.interviewRateModel.findByIdAndUpdate(ratingId, updateInterviewRateDto, { new: true }).exec();
    if (!updatedRating) {
      throw new NotFoundException('Rating not found or no update performed.');
    }
    return updatedRating;
  }

  async deleteRating(ratingId: string): Promise<boolean> {
    const result = await this.interviewRateModel.findByIdAndDelete(ratingId).exec();
    return result != null;
  }
}
