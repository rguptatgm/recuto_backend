import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import {
  RoleAlias,
  RoleMmbership,
  UserType,
} from 'src/globals/enums/global.enum';
import { PermissionGuard } from 'src/guards/permission.guard';
import { ServerPermission } from 'src/globals/enums/application.permission.enum';
import UpdateProjectDto from 'src/dtos/project/update.project.dto';
import { Permissions } from 'src/guards/permission.guard';
import CreateProjectDto from 'src/dtos/project/create.project.dto';
import { ProjectProtection } from 'src/schemas/project/project.schema';

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

  //! CREATE PROJECT

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Create a new project.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.CREATE_PROJECT, true)
  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ): Promise<any> {
    const createdProject = await this.projectService.create({
      document: createProjectDto,
      projection: ProjectProtection.DEFAULT(),
    });

    if (!createdProject) {
      throw new BadGatewayException();
    }

    await this.userRoleAssignService.assignUserToRole({
      userID: req['user']._id,
      userRole: RoleAlias.APP_USER,
      userType: UserType.USER,
      membership: RoleMmbership.USER,
      resource: createdProject._id,
    });

    await this.userRoleAssignService.assignProjectToPlan({
      resource: createdProject._id,
      role: RoleAlias.EXAMPLE_PLAN,
      type: UserType.USER,
    });

    return createdProject;
  }

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
