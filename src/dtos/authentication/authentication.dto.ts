import BaseAuthenticationDto from './base.authentication.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class AuthenticationDto extends BaseAuthenticationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  email?: string;
}

export default AuthenticationDto;
