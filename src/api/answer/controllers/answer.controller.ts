import { UseGuards, Controller, Post, Body, Req, Put, HttpException, HttpStatus, Get } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiBadRequestResponse, ApiOperation, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { CreateAnswerDto } from "src/dtos/answer/create.answer.dto";
import { UpdateAnswerDto } from "src/dtos/answer/update.answer.dto";
import { ServerPermission } from "src/globals/enums/application.permission.enum";
import { JwtAuthenticationGuard } from "src/guards/jwt.authentication.guard";
import { Permissions, PermissionGuard } from 'src/guards/permission.guard';
import { AnswerService } from "../services/answer.service";


@ApiTags('answers')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthenticationGuard)
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiCreatedResponse({ description: 'Resource successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Create Answer',
  })
  @Permissions(ServerPermission.CREATE_ANSWER, true)
  @Post()
  async createAnswer(
    @Body() createAnswerDto: CreateAnswerDto,
    @Req() req: Request,
  ): Promise<any> {
    const createdAnswer = await this.answerService.create({
      document: createAnswerDto,
      projection: { __v: 0 },
    });
    return createdAnswer;
  }

  @ApiCreatedResponse({ description: 'Resource successfully updated.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiOperation({
    summary: 'Update Answer',
  })
  @Put()
  async updateAnswer(
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const updatedAnswer = await this.answerService.updateByQuestionId(updateAnswerDto);
      if (!updatedAnswer) {
        throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
      }
      return updatedAnswer;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Get all answers.',
  })
  @Permissions(ServerPermission.GET_ANSWER, true)
  @Get()
  async getAnswers(@Req() req: Request): Promise<any> {
    return await this.answerService.find({
      conditions: {},
      projection: { __v: 0 },
    });
  }
}
