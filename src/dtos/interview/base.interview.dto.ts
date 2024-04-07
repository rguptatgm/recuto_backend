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

    //organizationID: TODO;


}

export default BaseInterviewDto;