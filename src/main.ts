import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const errorsForProperty = [];

        errors.forEach((e) => {
          const constrainKey = Object.keys(e.constraints);
          constrainKey.forEach((cKey) => {
            errorsForProperty.push({
              field: e.property,
              message: e.constraints[cKey],
            });
          });
        });

        throw new BadRequestException(errorsForProperty);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5005);
}
bootstrap();
