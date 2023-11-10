import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthenticationGuard } from 'src/guards/jwt.authentication.guard';
import { ProjectService } from '../services/project.service';
import { UserRoleAssignService } from 'src/api/shared/userRoleAssign/services/user.role.assign.service';
import { UserType } from 'src/globals/enums/global.enum';

// documentation
@ApiTags('projects')
@ApiBearerAuth('JWT')
//
@UseGuards(JwtAuthenticationGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userRoleAssignService: UserRoleAssignService,
  ) {}

  //! GET PROJECTS / ME

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Get all projects of the logged in user.',
  })
  //
  //
  @Get('/me')
  async getProjects(@Req() req: Request): Promise<any> {
    return await this.userRoleAssignService.getProjectsForUser({
      user: req['user'],
      userType: UserType.USER,
    });
  }
}
