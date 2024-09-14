import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { debugLog, logger } from './shared/logger';
import { VersioningType, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, 
    defaultVersion: '1',
  });
  const config = new DocumentBuilder()
    .setTitle('NestJs App APIs')
    .setDescription('NestJs App APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Bearer *token*',
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      'JWT',
    )
    .addSecurityRequirements('JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


  app.use(logger);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
  debugLog(`Application is running on port: ${process.env.PORT}`);
}
bootstrap();
