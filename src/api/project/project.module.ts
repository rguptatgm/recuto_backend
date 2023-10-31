import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from 'src/schemas/project/project.schema';
import { ProjectService } from './services/project.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
  ],
  controllers: [],
  providers: [ProjectService],
  exports: [],
})
export class ProjectnModule {}
