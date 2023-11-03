import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from '../services/user.service';
import { UserProtection } from 'src/schemas/user/user.schema';
import { UpdateUserDto } from 'src/dtos/user/update.user.dto';
import { JwtAuthenticationGuard } from 'src/guards/jwt.authentication.guard';

// documentation
@ApiTags('users')
@ApiBearerAuth('JWT')
//
// @UseGuards(JwtAuthenticationGuard)

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //! GET USER / ME

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Returns the logged in user.',
  })
  //
  //
  @Get('/me')
  async getUser(@Req() req: Request): Promise<any> {
    return await this.userService.findOne({
      conditions: { email: 'test@test.at' },
      projection: UserProtection.DEFAULT(),
      // populate: UserPopulate.DEFAULT(),
      options: {},
    });
  }

  //! UPDATE USER / ME

  // documentation
  @ApiCreatedResponse({ description: 'Successfully udated.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Update the logged in user.',
  })
  //
  //
  @Put('/me')
  async updateUserMe(@Body() updateUserDto: UpdateUserDto): Promise<any> {
    return await this.userService.updateOne({
      conditions: { email: 'test@test.at' },
      changes: updateUserDto,
      projection: UserProtection.DEFAULT(),
      // populate: UserPopulate.DEFAULT(),
      options: {},
    });
  }
}
