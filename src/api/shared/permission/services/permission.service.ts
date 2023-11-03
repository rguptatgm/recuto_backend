import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/schemas/permission/permission.schema';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';

@Injectable()
export class PermissionService extends GenericCrudService<PermissionDocument> {
  constructor(
    @InjectModel(Permission.name)
    readonly permission: Model<PermissionDocument>,
  ) {
    super(permission);
  }
}
