import { Body, Controller, Get, Put, Req, UseGuards, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthenticationGuard } from 'src/guards/jwt.authentication.guard';
import { Permissions, PermissionGuard } from 'src/guards/permission.guard';
import { ServerPermission } from 'src/globals/enums/application.permission.enum';
import { CreateCandidateDto } from 'src/dtos/candidate/create.candidate.dto';
import { UpdateCandidateDto } from 'src/dtos/candidate/update.candidate.dto';
import { CandidateService } from '../services/candidate.service';

@ApiTags('candidates')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthenticationGuard)
@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @ApiCreatedResponse({ description: 'Resource successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Create Candidate',
  })
  @Permissions(ServerPermission.CREATE_PARTICIPANT, true)
  @Post()
  async createCandidate(
    @Body() createCandidateDto: CreateCandidateDto,
    @Req() req: Request,
  ): Promise<any> {
    const createdCandidate = await this.candidateService.create({
      document: createCandidateDto,
      projection: { __v: 0 },
    });
    return createdCandidate;
  }

  @ApiCreatedResponse({ description: 'Resource successfully updated.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiOperation({
    summary: 'Update Candidate',
  })
  @Put()
  async updateCandidate(
    @Body() updateCandidateDto: UpdateCandidateDto,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const updatedCandidate = await this.candidateService.updateByEmailAndInterviewId(updateCandidateDto);
      if (!updatedCandidate) {
        throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND);
      }
      return updatedCandidate;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Get all candidates.',
  })
  @Permissions(ServerPermission.GET_PARTICIPANT, true)
  @Get()
  async getCandidates(@Req() req: Request): Promise<any> {
    return await this.candidateService.find({
      conditions: {},
      projection: { __v: 0 },
    });
  }
}
