import { Module, OnModuleInit, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envConfiguration } from './config/configuration.env';
import { envValidation } from './config/validation.env';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { PermissionModule } from './api/shared/permission/permission.module';
import { RoleModule } from './api/shared/role/role.module';
import { UserRoleAssignModule } from './api/shared/userRoleAssign/user.role.assign.module';
import { ProjectModule } from './api/project/project.module';
import { GlobalsModule } from './globals/globals.module';
import { AuthenticationModule } from './api/authentication/authentication.module';
import { RolePermissionGeneratorService } from './data.generators/role.permission.generator.service';
import { DataGeneratorModule } from './data.generators/data.generator.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResourceInterceptor } from './interceptors/resource.interceptor';
import { InvitationModule } from './api/Invitation/invitation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration],
      validationSchema: envValidation,
      envFilePath:
        process.env.NODE_ENV == 'production'
          ? '.env'
          : `.env.${process.env.NODE_ENV}`,
    }),

    MongooseModule.forRoot(process.env.MONGO_DB_CONNECT_URL, {
       //useNewUrlParser: true,
       //useFindAndModify: false,
       //useUnifiedTopology: true,
    }),

    //! Modules
    AuthenticationModule,
    UserRoleAssignModule,
    UserModule,
    PermissionModule,
    RoleModule,
    ProjectModule,
    GlobalsModule,
    DataGeneratorModule,
    InvitationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: ResourceInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly rolePermissionGeneratorService: RolePermissionGeneratorService,
  ) {}
  async onModuleInit() {
    console.log('\n');
    console.log('Generator Services:');
    await this.rolePermissionGeneratorService.createDefaultRoleAndPermissions();
    console.log('\n');
  }
}
