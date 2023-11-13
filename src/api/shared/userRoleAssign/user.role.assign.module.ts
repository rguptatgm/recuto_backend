import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../role/role.module';
import { UserRoleAssignAggregationQueryService } from './services/user.role.assign.aggregation.query.service';
import { UserRoleAssignService } from './services/user.role.assign.service';
import { UserRoleAssignSchema } from 'src/schemas/user.role.assign/user.role.assign.schema';
import { UserModule } from 'src/api/user/user.module';

@Global() // need to be because of the permission guard
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserRoleAssign', schema: UserRoleAssignSchema },
    ]),
    RoleModule,
    UserModule,
  ],
  controllers: [],
  providers: [UserRoleAssignService, UserRoleAssignAggregationQueryService],
  exports: [UserRoleAssignService],
})
export class UserRoleAssignModule {}
