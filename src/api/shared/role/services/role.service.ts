import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/schemas/role/role.schema';
import { GenericCrudService } from 'src/services/generic.crud.service';

@Injectable()
export class RoleService extends GenericCrudService<RoleDocument> {
  constructor(@InjectModel(Role.name) readonly role: Model<RoleDocument>) {
    super(role);
  }
}
