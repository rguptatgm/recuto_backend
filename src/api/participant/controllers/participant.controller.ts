import { Body, Controller, Get, Put, Req, UseGuards, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ParticipantService } from '../services/participant.service';
import { CreateParticipantDto } from 'src/dtos/participant/create.participant.dto';
import { UpdateParticipantDto } from 'src/dtos/participant/update.participant.dto';
import { JwtAuthenticationGuard } from 'src/guards/jwt.authentication.guard';
import { Permissions, PermissionGuard } from 'src/guards/permission.guard';
import { ServerPermission } from 'src/globals/enums/application.permission.enum';

@ApiTags('participants')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthenticationGuard)
@Controller('participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @ApiCreatedResponse({ description: 'Resource successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Create Participant',
  })
  @Permissions(ServerPermission.CREATE_PARTICIPANT, true)
  @Post()
  async createParticipant(
    @Body() createParticipantDto: CreateParticipantDto,
    @Req() req: Request,
  ): Promise<any> {
    const createdParticipant = await this.participantService.create({
      document: createParticipantDto,
      projection: { __v: 0 },
    });
    return createdParticipant;
  }

  @ApiCreatedResponse({ description: 'Resource successfully updated.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiOperation({
    summary: 'Update Participant',
  })
  @Put()
  async updateParticipant(
    @Body() updateParticipantDto: UpdateParticipantDto,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const updatedParticipant = await this.participantService.updateByEmailAndInterviewId(updateParticipantDto);
      if (!updatedParticipant) {
        throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
      }
      return updatedParticipant;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Get all participants.',
  })
  @Permissions(ServerPermission.GET_PARTICIPANT, true)
  @Get()
  async getParticipants(@Req() req: Request): Promise<any> {
    return await this.participantService.find({
      conditions: {},
      projection: { __v: 0 },
    });
  }
}
