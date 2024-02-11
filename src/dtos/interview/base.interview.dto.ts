import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseInterviewDto {

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    title: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    description: string;

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

    //organizationID: TODO;


}

export default BaseInterviewDto;