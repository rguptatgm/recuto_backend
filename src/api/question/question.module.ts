import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestionSchema } from "src/schemas/question/question.schema";
import { QuestionController } from "./controllers/question.controller";
import { QuestionService } from "./services/question.service";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Question', schema: QuestionSchema },
      ]),
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService],
  })
  export class QuestionModule {}