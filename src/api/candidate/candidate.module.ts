import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CandidateSchema } from "src/schemas/candidate/candidate.schema";
import { CandidateController } from "./controllers/candidate.controller";
import { CandidateService } from "./services/candidate.service";


@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Candidate', schema: CandidateSchema },
      ]),
    ],
    controllers: [CandidateController],
    providers: [CandidateService],
    exports: [CandidateService],
})
export class CandidateModule {}
