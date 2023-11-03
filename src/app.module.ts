import { Module } from '@nestjs/common';
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
import { ProjectnModule } from './api/project/project.module';
import { GlobalsModule } from './globals/globals.module';

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
      // useNewUrlParser: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    }),

    //! Modules

    UserModule,
    PermissionModule,
    RoleModule,
    UserRoleAssignModule,
    ProjectnModule,
    GlobalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
