import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class BaseUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  lastName: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ type: String })
  email: string;

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  dateOfBirth?: Date;
}

export default BaseUserDto;
