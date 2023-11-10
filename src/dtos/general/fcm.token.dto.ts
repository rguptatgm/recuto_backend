import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FcmTokenDto {
  @IsString()
  @ApiProperty({ type: String })
  fcmToken: string;
}
