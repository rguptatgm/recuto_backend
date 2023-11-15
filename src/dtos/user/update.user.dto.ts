import BaseUserDto from './base.user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto extends BaseUserDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  setupCompleted: boolean;
}
