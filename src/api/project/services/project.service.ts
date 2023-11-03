import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'src/schemas/project/project.schema';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';

@Injectable()
export class ProjectService extends GenericCrudService<ProjectDocument> {
  constructor(
    @InjectModel(Project.name) readonly project: Model<ProjectDocument>,
  ) {
    super(project);
  }
}
