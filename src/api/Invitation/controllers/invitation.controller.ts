import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
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
import { CreateInvitationDto } from 'src/dtos/invitation/create.invitation.dto';
import { JwtAuthenticationGuard } from 'src/guards/jwt.authentication.guard';
import {
  InvitationPopulate,
  InvitationProtection,
} from 'src/schemas/invitation/invitation.schema';
import { InvitationService } from '../services/Invitation.service';
import { ServerPermission } from 'src/globals/enums/application.permission.enum';
import { PermissionGuard, Permissions } from 'src/guards/permission.guard';
import { ResourceInterceptor } from 'src/interceptors/resource.interceptor';
import { UserType } from 'src/globals/enums/global.enum';

// documentation
@ApiTags('invitations')
@ApiBearerAuth('JWT')
//
@UseInterceptors(ResourceInterceptor)
@UseGuards(JwtAuthenticationGuard)
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  //! CREATE INVITATION

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Create invitation for requested resource.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.CREATE_PROJECT_INVITATION)
  @Post()
  async createInvitation(
    @Body() createInvitationDto: CreateInvitationDto,
    @Req() req: Request,
  ): Promise<any> {
    const createdInvitation =
      await this.invitationService.handleCreateInvitation({
        createInvitationDto,
        reqUser: req['user'],
        reqProject: req['project'],
        type: UserType.USER,
      });

    return createdInvitation;
  }

  //! RESEND INVITATION

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Resend invitation for requested invitation.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.CREATE_PROJECT_INVITATION)
  @Post(':invitationID/resend')
  async resendInvitation(
    @Param('invitationID') invitationID: string,
    @Req() req: Request,
  ): Promise<any> {
    const resendedInvitation =
      await this.invitationService.handleResendInvitation({
        invitationID,
        reqUser: req['user'],
        reqProject: req['project'],
      });

    return resendedInvitation;
  }

  //! GET INVITATION /ME

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Returns all open invitations from requested user.',
  })
  //
  //
  @Get('/me')
  async getUserInvitations(@Req() req: Request) {
    const userInvitations = await this.invitationService.find({
      conditions: { email: req['user'].email },
      projection: InvitationProtection.DEFAULT(),
      populate: InvitationPopulate.DEFAULT(),
    });

    return userInvitations;
  }

  //! GET OPEN INVITATION FOR RESOURCE

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Returns all open invitations from requested resource.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.GET_OPEN_PROJECT_INVITATIONS)
  @Get()
  async getOpenInvitationsForResource(@Req() req: Request) {
    const invitations = await this.invitationService.find({
      conditions: { resource: req['user'].resource },
      projection: InvitationProtection.DEFAULT(),
      populate: InvitationPopulate.DEFAULT(),
    });

    return invitations;
  }

  //! DELETE INVITATION

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully deleted.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Delete invitation from requested resource.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.DELETE_PROJECT_INVITATION)
  @Delete('/:invitationID')
  async deleteInvitation(
    @Param('invitationID') invitationID: string,
    @Req() req: Request,
  ) {
    const deletedInvitation = await this.invitationService.deleteOne({
      conditions: {
        $and: [{ _id: invitationID }, { resource: req['user'].resource }],
      },
    });

    return deletedInvitation;
  }

  //! ACCEPT INVITATION

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully accepted.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Accept invitation from requested resource.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.ACCEPT_PROJECT_INVITATION, true)
  @Put('/:invitationID/accept')
  async acceptInvitation(
    @Param('invitationID') invitationID: string,
    @Req() req: Request,
  ) {
    const acceptedInvitation =
      await this.invitationService.handleAcceptInvitation({
        invitationID,
        reqUser: req['user'],
      });

    return acceptedInvitation;
  }

  //! DECLINE INVITATION

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully declined.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Decline invitation from requested resource.',
  })
  //
  //
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.DECLINE_PROJECT_INVITATION, true)
  @Put('/:invitationID/decline')
  async declineInvitation(
    @Param('invitationID') invitationID: string,
    @Req() req: Request,
  ) {
    const declinedInvitation =
      await this.invitationService.handleDeclineInvitation({
        invitationID,
        reqUser: req['user'],
      });

    return declinedInvitation;
  }
}
