import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from './util/config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use(bodyParser.urlencoded({ extended: true }));
  await app.listen(3000);
}

bootstrap();
