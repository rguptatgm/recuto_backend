import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ParticipantSchema } from "src/schemas/participant/participant.schema";
import { ParticipantController } from "src/api/participant/controllers/participant.controller";
import { ParticipantService } from "src/api/participant/services/participant.service";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Participant', schema: ParticipantSchema },
      ]),
    ],
    controllers: [ParticipantController],
    providers: [ParticipantService],
    exports: [ParticipantService],
})
export class ParticipantModule {}
