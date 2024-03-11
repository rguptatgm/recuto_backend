import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { GenericCrudService } from "src/globals/services/generic.crud.service";
import {Organization, OrganizationDocument} from "../../../schemas/organization/organization.schema";


@Injectable()
export class OrganizationService extends GenericCrudService<OrganizationDocument> {
    constructor(
        @InjectModel(Organization.name)
        readonly organization: Model<OrganizationDocument>,
    ){
        super(organization);
    }

}