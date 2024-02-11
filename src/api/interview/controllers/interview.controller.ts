import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { InterviewService } from "../services/interview.service";
import { InterviewProtection } from "src/schemas/interview/interview.schema";
import { CreateInterviewDto } from "src/dtos/interview/create.interview.dto";
import { ApiTags, ApiBearerAuth, ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation } from "@nestjs/swagger";
import { JwtAuthenticationGuard } from "src/guards/jwt.authentication.guard";
import { PermissionGuard, Permissions } from "src/guards/permission.guard";
import { ServerPermission } from 'src/globals/enums/application.permission.enum';

// documentation
@ApiTags('interviews')
@ApiBearerAuth('JWT')
//
// @UseInterceptors(ResourceInterceptor) // TODO fix this
@UseGuards(JwtAuthenticationGuard)
@Controller('interviews')
export class InterviewController{
    constructor(private readonly interviewService: InterviewService){}

    //! CREATE INVITATION

    // documentation
    @ApiCreatedResponse({ description: 'Resource successfully created.' })
    @ApiForbiddenResponse({ description: 'Forbidden resource.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiOperation({
        summary: 'Create Interview',
    })
    //
    //
    @UseGuards(PermissionGuard)
    @Permissions(ServerPermission.CREATE_INTERVIEW, true)
    @Post()
    async createInterview(
        @Body() createInterviewDto: CreateInterviewDto,
        @Req() req: Request,
    ): Promise<any>{
        const createdInterview = await this.interviewService.create({
            document: createInterviewDto,
            projection: InterviewProtection.DEFAULT,
        });

        return createdInterview;
    }
}