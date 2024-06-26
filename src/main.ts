import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { ValidationExceptionFilter } from './filters/validation.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  //configure global api prexix https://domain/api/...route
  app.setGlobalPrefix('api');

  // configure global exeption and validation filters
  app.useGlobalFilters(
    // new FallbackExceptionFilter(),
    // new HttpExceptionFilter(app.get(SentryService)), // TODO @tobias configure sentry
    new ValidationExceptionFilter(),
  );

  // dto validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // password projection swagger documentation
  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  // init swagger documentation
  const config = new DocumentBuilder()
    .setTitle('NestJs Template REST API Documentation')
    .setDescription('NestJs Template REST API documentation')
    .setVersion('1.0')
    .setBasePath('docs')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(9000);
}

bootstrap();
