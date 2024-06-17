import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnswerSchema } from "src/schemas/answer/answer.schema";
import { AnswerController } from "./controllers/answer.controller";
import { AnswerService } from "./services/answer.service";


@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Answer', schema: AnswerSchema },
      ]),
    ],
    controllers: [AnswerController],
    providers: [AnswerService],
    exports: [AnswerService],
})
export class AnswerModule {}
