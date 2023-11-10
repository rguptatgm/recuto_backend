import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from 'src/schemas/project/project.schema';
import { ProjectService } from './services/project.service';
import { UserRoleAssignModule } from '../shared/userRoleAssign/user.role.assign.module';
import { ProjectController } from './controllers/project.controller';

@Module({
  imports: [
    UserRoleAssignModule,
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [],
})
export class ProjectnModule {}
