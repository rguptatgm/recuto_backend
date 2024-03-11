import { ApiProperty } from "@nestjs/swagger";
import {IsOptional, IsString} from 'class-validator';

export class BaseOrganizationDto {

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    title: string;

}

export default BaseOrganizationDto;