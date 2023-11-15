import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class ChangePasswordDto {
  @IsString()
  @ApiProperty({ type: String })
  password: string;

  @IsString()
  @ApiProperty({ type: String })
  newPassword: string;
}

export default ChangePasswordDto;
