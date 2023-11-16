import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleService } from 'src/api/shared/role/services/role.service';
import { UserRoleAssignService } from 'src/api/shared/userRoleAssign/services/user.role.assign.service';
import { CreateInvitationDto } from 'src/dtos/invitation/create.invitation.dto';
import { RoleMmbership, UserType } from 'src/globals/enums/global.enum';
import { getResourceUserFieldBasedOnUserType } from 'src/globals/helper/resource.helper';
import { RequestUser } from 'src/globals/interfaces/global.interface';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';
import {
  Invitation,
  InvitationDocument,
  InvitationPopulate,
  InvitationProtection,
} from 'src/schemas/invitation/invitation.schema';
import { Project } from 'src/schemas/project/project.schema';

@Injectable()
export class InvitationService extends GenericCrudService<InvitationDocument> {
  constructor(
    @InjectModel(Invitation.name)
    readonly invitation: Model<InvitationDocument>,
    private readonly roleService: RoleService,
    private readonly userRoleAssignService: UserRoleAssignService, // private readonly clientNotificationService: ClientNotificationService,
  ) {
    super(invitation);
  }

  handleResendInvitation = async (args: {
    invitationID: string;
    reqUser: any;
    reqProject: Project;
  }) => {
    const invitation = await this.findOne({
      conditions: { _id: args.invitationID },
      projection: InvitationProtection.DEFAULT(),
      populate: InvitationPopulate.DEFAULT(),
    });

    if (!invitation) {
      throw new BadGatewayException("Invitation doesn't exist.");
    }

    // send invitation accepted email
    // await this.clientNotificationService.sendInvitationEmail({
    //   recipient: invitation.email,
    //   reqUser: args.reqUser,
    //   studio: args.reqStudio as any,
    // });

    return invitation;
  };

  handleCreateInvitation = async (args: {
    reqUser: RequestUser;
    reqProject: Project;
    createInvitationDto: CreateInvitationDto;
    type: UserType.USER;
  }) => {
    // check if user is already invited to studio
    const invitationExists = await this.findOne({
      conditions: {
        email: args.createInvitationDto.email,
        resource: args.reqUser.resource,
        type: args.type,
      },
      projection: InvitationProtection.DEFAULT(),
      populate: InvitationPopulate.DEFAULT(),
    });

    if (invitationExists) {
      return invitationExists;
    }

    // get the role of the invitation
    const role = await this.roleService.findOne({
      conditions: {
        $and: [{ _id: args.createInvitationDto.role }],
      },
    });

    if (!role) {
      throw new BadGatewayException('Role does not exist.');
    }

    // create invitation and return it
    const createdInvitation = await this.create({
      document: {
        ...args.createInvitationDto,
        resource: args.reqUser.resource,
        type: args.type,
      },
      projection: InvitationProtection.DEFAULT(),
      populate: InvitationPopulate.DEFAULT(),
    });

    if (createdInvitation) {
      // TODO create notification service
      // send invitation accepted email
      // await this.clientNotificationService.sendInvitationEmail({
      //   recipient: args.createInvitationDto.email,
      //   reqUser: args.reqUser,
      //   studio: args.reqStudio as any,
      // });
    }

    return createdInvitation;
  };

  handleAcceptInvitation = async (args: {
    reqUser: any;
    invitationID: string;
  }) => {
    // get the invitation
    const invitation = await this.findOne({
      conditions: { _id: args.invitationID, email: args.reqUser.email },
    });

    if (!invitation) {
      throw new BadGatewayException("Invitation doesn't exist.");
    }

    // get the role of the invitation
    const role = await this.roleService.findOne({
      conditions: { _id: invitation.role },
    });

    if (!role) {
      throw new BadGatewayException('Role does not exist.');
    }

    // check if the user already assigned to the resource with the role
    const userRoleAssignExists = await this.userRoleAssignService.findOne({
      conditions: {
        user: args.reqUser._id,
        resource: invitation.resource,
      },
    });

    if (userRoleAssignExists) {
      return userRoleAssignExists;
    }

    // get the user field based on the user type of the invitation
    const userField = getResourceUserFieldBasedOnUserType({
      userType: invitation.type,
    });

    // create user role assign
    const userRoleAssign = await this.userRoleAssignService.create({
      document: {
        [userField]: args.reqUser._id,
        resource: invitation.resource,
        role: role._id,
        validFrom: new Date(),
        validUntil: new Date('2222'),
        membership: RoleMmbership.USER,
        type: invitation.type,
      },
    });

    if (!userRoleAssign) {
      throw new BadGatewayException('User role assign could not be created.'); // TODO check if this error is needed or not
    }

    // delete the invitation
    await this.deleteOne({
      conditions: { _id: invitation._id },
    });

    return userRoleAssign;
  };

  handleDeclineInvitation = async (args: {
    reqUser: any;
    invitationID: string;
  }) => {
    // get the invitation
    const invitation = await this.findOne({
      conditions: { _id: args.invitationID, email: args.reqUser.email },
    });

    if (!invitation) {
      throw new BadGatewayException("Invitation doesn't exist.");
    }

    // delete the invitation
    await this.deleteOne({
      conditions: { _id: invitation._id },
    });

    return invitation;
  };
}
