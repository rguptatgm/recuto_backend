import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/api/shared/role/role.module';
import { UserRoleAssignModule } from 'src/api/shared/userRoleAssign/user.role.assign.module';
import { InvitationController } from './controllers/invitation.controller';
import { InvitationService } from './services/Invitation.service';
import { InvitationSchema } from 'src/schemas/invitation/invitation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Invitation', schema: InvitationSchema },
    ]),
    // DashboardUserModule,
    RoleModule,
    UserRoleAssignModule,
    // NotificationModule,
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
