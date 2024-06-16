import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InterviewRateSchema } from "src/schemas/interview.candidate/interview-rate.schema";
import { InterviewRateController } from "./controllers/interview.rate.controller";
import { InterviewRateService } from "./services/interview.rate.service";


@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'InterviewRate', schema: InterviewRateSchema },
      ]),
    ],
    controllers: [InterviewRateController],
    providers: [InterviewRateService],
    exports: [InterviewRateService],
  })
  export class InterviewRateModule {}