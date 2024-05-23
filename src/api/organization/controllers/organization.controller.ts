import {Body, Controller, Get, Post, Req, UseGuards} from "@nestjs/common";

import { ApiTags, ApiBearerAuth, ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation } from "@nestjs/swagger";
import { JwtAuthenticationGuard } from "src/guards/jwt.authentication.guard";
import { PermissionGuard, Permissions } from "src/guards/permission.guard";
import { ServerPermission } from 'src/globals/enums/application.permission.enum';
import {CreateOrganizationDto} from "../../../dtos/organization/create.organization.dto";
import {OrganizationProtection} from "../../../schemas/organization/organization.schema";
import {OrganizationService} from "../services/organization.service";
import {Request} from "express";
import {UserType} from "../../../globals/enums/global.enum";
import {UserRoleAssignService} from "../../shared/userRoleAssign/services/user.role.assign.service";
import {InvitationPopulate, InvitationProtection} from "../../../schemas/invitation/invitation.schema";

// documentation
@ApiTags('organizations')
@ApiBearerAuth('JWT')
//
// @UseInterceptors(ResourceInterceptor) // TODO fix this
@UseGuards(JwtAuthenticationGuard)
@Controller('organizations')
export class OrganizationController{
    constructor(
        private readonly organizationService: OrganizationService,
        private readonly userRoleAssignService: UserRoleAssignService,
    ){}

    //! CREATE INVITATION

    // documentation
    @ApiCreatedResponse({ description: 'Resource successfully created.' })
    @ApiForbiddenResponse({ description: 'Forbidden resource.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiOperation({
        summary: 'Create Organization',
    })
    //
    //
    @UseGuards(PermissionGuard)
    @Permissions(ServerPermission.CREATE_ORGANIZATION, true)
    @Post()
    async createOrganization(
        @Body() createOrganizationDto: CreateOrganizationDto,
        @Req() req: Request,
    ): Promise<any>{
        const createdOrganization = await this.organizationService.create({
            document: createOrganizationDto,
            projection: OrganizationProtection.DEFAULT,
        });

        return createdOrganization;
    }

    @ApiCreatedResponse({ description: 'Resource successfully returned.' })
    @ApiForbiddenResponse({ description: 'Forbidden resource.' })
    @ApiOperation({
        summary: 'Get all organizations of the logged in user.',
    })
    //
    //
    @UseGuards(PermissionGuard)
    @Permissions(ServerPermission.GET_PROJECTS, true)
    @Get()
    async getOrganizations(@Req() req: Request): Promise<any> {
        return await this.organizationService.find({
            conditions: { },
            projection: { title: 1 },
        });
    }
}