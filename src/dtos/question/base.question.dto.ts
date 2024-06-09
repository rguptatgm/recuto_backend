import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from "mongodb";

export class BaseQuestionDto {

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    title: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    fullQuestion: string;

    @IsOptional()
    @IsString()
    @ApiProperty({type:String})
    type: string;

    @IsOptional()
    @IsString()
    @ApiProperty({type:String})
    videoUrl: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ type: Number })
    thinkingTime: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ type: Number })
    maxAnswerTime: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ type: Number })
    maxRetakes: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ type: Number })
    sort: number;

    @IsOptional()
    @ApiProperty({type: ObjectId})
    interviewID: ObjectId;
}

export default BaseQuestionDto;