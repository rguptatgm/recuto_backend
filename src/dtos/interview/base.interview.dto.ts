import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from 'class-validator';
import { ObjectId } from "mongodb";

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
    @ApiProperty({type: ObjectId})
    organizationID: ObjectId;
}

export default BaseInterviewDto;