import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsString } from 'class-validator';

export class BaseInvitationDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ type: String })
  email: string;

  @IsString()
  @IsMongoId()
  @ApiProperty({ type: String })
  role: string;
}

export default BaseInvitationDto;
