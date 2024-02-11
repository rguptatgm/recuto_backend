import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InterviewSchema } from "src/schemas/interview/interview.schema";
import { InterviewController } from "./controllers/interview.controller";
import { InterviewService } from "./services/interview.service";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Interview', schema: InterviewSchema },
      ]),
    ],
    controllers: [InterviewController],
    providers: [InterviewService],
    exports: [InterviewService],
  })
  export class InterviewModule {}