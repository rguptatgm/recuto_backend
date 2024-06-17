import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail, IsDate, IsArray, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from "mongodb";

export class BaseCandidateDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    firstName: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String })
    lastName: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ type: String })
    email: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: Date })
    dateOfBirth: Date;

    @IsOptional()
    @ApiProperty({ type: ObjectId })
    interviewID: ObjectId;

    @IsOptional()
    @ApiProperty({ type: ObjectId })
    organizationID: ObjectId;
}

export default BaseCandidateDto;
