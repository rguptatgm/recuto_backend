import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class BaseProjectDto {
  @IsString()
  @ApiProperty({ type: String })
  name: string;
}

export default BaseProjectDto;
