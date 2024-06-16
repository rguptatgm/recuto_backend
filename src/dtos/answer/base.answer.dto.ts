import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ObjectId } from "mongodb";

export class BaseAnswerDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    videoUrl: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    comment: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ type: Number })
    rating: number;

    @IsOptional()
    @ApiProperty({type: ObjectId})
    candidateID: ObjectId;

    @IsOptional()
    @ApiProperty({ type: ObjectId })
    interviewQuestionID: ObjectId;

    @IsOptional()
    @ApiProperty({ type: ObjectId })
    organizationID: ObjectId;
}

export default BaseAnswerDto;
