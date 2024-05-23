import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail, IsDate, IsArray, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from "mongodb";

export class BaseParticipantDto {
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
    interviewId: ObjectId;

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    @ApiProperty({ type: [String] })
    videoUrls?: string[];
}

export default BaseParticipantDto;
