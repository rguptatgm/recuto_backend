import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {OrganizationSchema} from "../../schemas/organization/organization.schema";
import {OrganizationController} from "./controllers/organization.controller";
import {OrganizationService} from "./services/organization.service";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Organization', schema: OrganizationSchema },
        ]),
    ],
    controllers: [OrganizationController],
    providers: [OrganizationService],
    exports: [OrganizationService],
})
export class OrganizationModule {}