import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: [
      configService.get('CLIENT_HOST'),
      configService.get('ANGULAR_APP_CLIENT_HOST'),
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  app.use(cookieParser());
  await app.listen(configService.get('PORT', 3001));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
