import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { PinoLoggerService } from './common/logger/pino-logger.service.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
    bufferLogs: true,
  });
  app.useLogger(app.get(PinoLoggerService));
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Addis Eats API')
    .setDescription('Authentication and protected routes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      stopAtFirstError: false,
      disableErrorMessages: false,
    }),
    
  );
  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
