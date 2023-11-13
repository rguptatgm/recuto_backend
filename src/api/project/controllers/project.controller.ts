import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
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
import { PermissionGuard } from 'src/guards/permission.guard';
import { ServerPermission } from 'src/globals/enums/application.permission.enum';
import UpdateProjectDto from 'src/dtos/project/update.project.dto';
import { Permissions } from 'src/guards/permission.guard';

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

  //! GET PROJECTS

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Get all projects of the logged in user.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.GET_PROJECTS, true)
  @Get()
  async getProjects(@Req() req: Request): Promise<any> {
    console.log('getProjects');
    return await this.userRoleAssignService.getProjectsForUser({
      user: req['user'],
      userType: UserType.USER,
    });
  }

  //! UPDATE CURRENT PROJECT

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully updated.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Update requested project.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.UPDATE_CURRENT_PROJECT)
  @Put()
  async updateStudio(
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    return await this.projectService.updateOne({
      conditions: { _id: req['user'].resource },
      changes: updateProjectDto,
    });
  }
}
