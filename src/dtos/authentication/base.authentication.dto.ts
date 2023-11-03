import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountKind, PlatformKind } from 'src/globals/enums/global.enum';

class BaseAuthenticationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  email?: string;

  @IsEnum(AccountKind)
  @ApiProperty({ type: String })
  kind: AccountKind;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  socialVerifyToken?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  deviceIdentifierID?: string;

  @IsOptional()
  @IsString()
  @IsEnum(PlatformKind)
  @ApiProperty({ type: String })
  platform?: PlatformKind;
}

export default BaseAuthenticationDto;
