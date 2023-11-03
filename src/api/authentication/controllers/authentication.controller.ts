import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPrepareService } from '../services/core/generic.jwt.prepare.service';
import { UserRoleAssignService } from 'src/api/shared/userRoleAssign/services/user.role.assign.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthenticationService } from '../services/user.authentication.service';
import { TokenType, UserType } from 'src/globals/enums/global.enum';
import { JwtRefreshAuthenticationGuard } from 'src/guards/jwt.refresh.authentication.guard';
import { PermissionType } from 'src/globals/enums/application.permission.enum';
import AuthenticationDto from 'src/dtos/authentication/authentication.dto';
import RefreshTokenDto from 'src/dtos/authentication/refresh.token.dto';
import { UserDocument } from 'src/schemas/user/user.schema';

// documentation
@ApiTags('authentication')
//
@Controller('auth')
export class AuthenticationController {
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
  @UseGuards(AuthGuard('api-key'))
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
  @UseGuards(AuthGuard('api-key'))
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
  // @UseGuards(
  //   JwtRefreshAuthenticationGuard,
  //   PermissionGuard([ServerPermission.GET_CLIENT_PERMISSIONS]), // TODO add permission guard
  // )
  @Get('/client-permissions')
  async getClientPermissions(@Req() req: Request) {
    if (req['user'].resource == null || req['user']._id == null) {
      return [];
    }

    const userClientPermissions =
      await this.userRoleAssignService.getUserPermissionsForAllResources({
        userID: req['user']._id,
        permissionType: PermissionType.APP_CLIENT,
        userType: UserType.USER,
        forResource: req['user'].resource,
      });

    return userClientPermissions;
  }
}
