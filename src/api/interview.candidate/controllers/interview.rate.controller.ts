import {
    Controller, Post, Body, Param, Get, Put, Delete, NotFoundException, BadRequestException, HttpStatus
  } from '@nestjs/common';
import { InterviewRateService } from '../services/interview.rate.service';
import { CreateInterviewRateDto } from 'src/dtos/interviewRate/create.interview.rate.dto';
import { UpdateInterviewRateDto } from 'src/dtos/interviewRate/update.interview.rate.dto';
  
  @Controller('interviews/:interviewId/videos/:videoId/ratings')
  export class InterviewRateController {
    constructor(private readonly interviewRateService: InterviewRateService) {}
  
    @Post()
    async addRating(
      @Param('interviewId') interviewId: string,
      @Param('videoId') videoId: string,
      @Body() createInterviewRateDto: CreateInterviewRateDto,
    ) {
      return this.interviewRateService.addRating(interviewId, videoId, createInterviewRateDto);
    }
  
    @Get()
    async getRatings(
      @Param('interviewId') interviewId: string,
      @Param('videoId') videoId: string
    ) {
      const ratings = await this.interviewRateService.getRatings(interviewId, videoId);
      if (!ratings.length) {
        throw new NotFoundException('No ratings found.');
      }
      return ratings;
    }
  
    @Put(':ratingId')
    async updateRating(
      @Param('interviewId') interviewId: string,
      @Param('videoId') videoId: string,
      @Param('ratingId') ratingId: string,
      @Body() updateInterviewRateDto: UpdateInterviewRateDto,
    ) {
      const updatedRating = await this.interviewRateService.updateRating(interviewId, videoId, ratingId, updateInterviewRateDto);
      if (!updatedRating) {
        throw new NotFoundException('Rating not found or no update performed.');
      }
      return updatedRating;
    }
  
    @Delete(':ratingId')
    async deleteRating(
      @Param('ratingId') ratingId: string,
    ) {
      const result = await this.interviewRateService.deleteRating(ratingId);
      if (!result) {
        throw new NotFoundException('Rating not found.');
      }
      return { statusCode: HttpStatus.OK, message: 'Rating successfully deleted.' };
    }
  }
  