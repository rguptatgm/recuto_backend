import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPrepareService } from '../services/core/generic.jwt.prepare.service';
import { UserRoleAssignService } from 'src/api/shared/userRoleAssign/services/user.role.assign.service';
import { TokenType, UserType } from 'src/globals/enums/global.enum';
import { JwtRefreshAuthenticationGuard } from 'src/guards/jwt.refresh.authentication.guard';
import {
  PermissionType,
  ServerPermission,
} from 'src/globals/enums/application.permission.enum';
import AuthenticationDto from 'src/dtos/authentication/authentication.dto';
import RefreshTokenDto from 'src/dtos/authentication/refresh.token.dto';
import { UserDocument } from 'src/schemas/user/user.schema';
import { UserAuthenticationService } from '../services/user.authentication.service';
import { JwtAuthenticationGuard } from 'src/guards/jwt.authentication.guard';
import { PermissionGuard, Permissions } from 'src/guards/permission.guard';
import ChangePasswordDto from 'src/dtos/authentication/change.password.dto';

// documentation
@ApiTags('authentication')
//
@Controller('auth')
export class UserAuthenticationController {
  constructor(
    private readonly jwtPrepareService: JwtPrepareService<UserDocument>,
    private readonly userRoleAssignService: UserRoleAssignService,
    private readonly userAuthenticationService: UserAuthenticationService,
  ) {}

  //! SIGN-UP

  // documentation
  @ApiCreatedResponse({ description: 'Successfull signUp.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Register a new user.',
  })
  //
  //
  @Post('/sign-up')
  async signUp(@Body() authDto: AuthenticationDto): Promise<any> {
    const signUpResult = await this.userAuthenticationService.signUp({
      authData: {
        authDto,
        customData: {}, // pass custom data here and it will be available in all abstract methods of the authentication
      },
    });
    return signUpResult;
  }

  //! SIGN-IN

  // documentation
  @ApiCreatedResponse({ description: 'Successfull signUp.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Login a user.',
  })
  //
  //
  @Post('/sign-in')
  async signIn(@Body() authDto: AuthenticationDto): Promise<any> {
    const result = await this.userAuthenticationService.signIn({
      authData: {
        authDto,
        customData: {}, // pass custom data here and it will be available in all abstract methods of the authentication
      },
    });
    return result;
  }

  //! CHANGE PASSWORD

  // documentation
  @ApiBearerAuth('JWT')
  @ApiCreatedResponse({ description: 'Successfull signUp.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Change password for requested user.',
  })
  //
  //
  @UseGuards(JwtAuthenticationGuard, PermissionGuard)
  @Permissions(ServerPermission.DASHBOARD_CHANGE_USER_PASSWORD, true)
  @Post('/change-password')
  async changeUserPassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<any> {
    return await this.userAuthenticationService.handleChangePassword({
      newPassword: changePasswordDto.newPassword,
      password: changePasswordDto.password,
      reqUser: req['user'],
    });
  }

  //! REFRESH-TOKEN

  // documentation
  @ApiCreatedResponse({ description: 'Successfull jwt token validated.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiOperation({
    summary: 'Returns a new token.',
  })
  //
  //
  @UseGuards(JwtRefreshAuthenticationGuard)
  @Post('/refresh-token')
  async getRefreshToken(
    @Body() refreshToken: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<any> {
    const resource = req['user']?.resource;

    if (!resource) {
      const result = await this.jwtPrepareService.prepareJwtResponse({
        userDocument: req['user'],
        withoutRefreshToken: true,
      });

      return result;
    }

    const result = await this.jwtPrepareService.prepareJwtResponse({
      userDocument: req['user'],
      withoutRefreshToken: true,
      payload: {
        resource: resource,
        tokenType: TokenType.DEFAULT,
      },
    });

    return result;
  }

  //! GET CLIENT PERMISSIONS

  // documentation
  @ApiCreatedResponse({ description: 'Resource successfully returned.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiOperation({
    summary: 'Retuns client permissions for requested user',
  })
  //
  //
  @UseGuards(JwtAuthenticationGuard)
  @Get('/client-permissions')
  async getClientPermissions(@Req() req: Request) {
    if (req['user']._id == null) {
      return [];
    }

    const userClientPermissions =
      await this.userRoleAssignService.getUserPermissionsForAllResources({
        userID: req['user']._id,
        permissionType: PermissionType.APP_CLIENT,
        userType: UserType.USER,
        forResource: req.headers['resource'],
      });

    return userClientPermissions;
  }
}
