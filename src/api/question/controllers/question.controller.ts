import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation } from "@nestjs/swagger";
import { JwtAuthenticationGuard } from "src/guards/jwt.authentication.guard";
import { PermissionGuard, Permissions } from "src/guards/permission.guard";
import { ServerPermission } from 'src/globals/enums/application.permission.enum';
import { QuestionService } from "../services/question.service";
import { CreateQuestionDto } from "src/dtos/question/create.question.dto";
import { QuestionProtection } from "src/schemas/question/question.schema";

// documentation
@ApiTags('questions')
@ApiBearerAuth('JWT')
//
// @UseInterceptors(ResourceInterceptor) // TODO fix this
@UseGuards(JwtAuthenticationGuard)
@Controller('questions')
export class QuestionController{
    constructor(private readonly questionService: QuestionService){}

    //! CREATE INVITATION

    // documentation
    @ApiCreatedResponse({ description: 'Resource successfully created.' })
    @ApiForbiddenResponse({ description: 'Forbidden resource.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiOperation({
        summary: 'Create Question',
    })
    //
    //
    @UseGuards(PermissionGuard)
    @Permissions(ServerPermission.CREATE_INTERVIEW, true)
    @Post()
    async createQuestion(
        @Body() createQuestionDto: CreateQuestionDto,
        @Req() req: Request,
    ): Promise<any>{
        const createdQuestion = await this.questionService.create({
            document: createQuestionDto,
            projection: QuestionProtection.DEFAULT,
        });

        return createdQuestion;
    }
}