import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class RefreshTokenDto {
  @IsString()
  @ApiProperty({ type: String })
  refresh_token: string;
}

export default RefreshTokenDto;
