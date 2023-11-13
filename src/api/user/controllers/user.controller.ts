import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
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
import { FcmTokenDto } from 'src/dtos/general/fcm.token.dto';
import { Permissions, PermissionGuard } from 'src/guards/permission.guard';
import { ServerPermission } from 'src/globals/enums/application.permission.enum';

// documentation
@ApiTags('users')
@ApiBearerAuth('JWT')
//
@UseGuards(JwtAuthenticationGuard)
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
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.GET_USER_ME, true)
  @Get('/me')
  async getUser(@Req() req: Request): Promise<any> {
    return await this.userService.findOne({
      conditions: { _id: req['user']._id },
      projection: UserProtection.DEFAULT(),
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
  @UseGuards(PermissionGuard)
  @Permissions(ServerPermission.UPDATE_USER_ME, true)
  @Put('/me')
  async updateUserMe(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<any> {
    return await this.userService.updateOne({
      conditions: { _id: req['user']._id },
      changes: updateUserDto,
      projection: UserProtection.DEFAULT(),
    });
  }

  //! REGISTER FCM TOKEN

  // documentation
  @ApiCreatedResponse({ description: 'Successfully added.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Add fcm token to logged in user.',
  })
  //
  //
  @Post('/me/fcm-token')
  async addFcmToken(
    @Req() req: Request,
    @Body() body: FcmTokenDto,
  ): Promise<any> {
    return await this.userService.addFcmToken({
      user: req['user'],
      fcmToken: body.fcmToken,
    });
  }

  //! UNREGISTER FCM TOKEN

  // documentation
  @ApiCreatedResponse({ description: 'Successfully removed.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Remove fcm token from logged in user.',
  })
  //
  //
  @Delete('/me/fcm-token')
  async removeFcmToken(
    @Req() req: Request,
    @Body() body: FcmTokenDto,
  ): Promise<any> {
    return await this.userService.removeFcmToken({
      user: req['user'],
      fcmToken: body.fcmToken,
    });
  }
}
