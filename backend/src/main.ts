import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as dotenv from 'dotenv';


dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 4000;
  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2)); //Сохранение спецификации!!!
  SwaggerModule.setup('docx', app, document); // Установите путь к Swagger UI
  await app.listen(port); // Запуск приложения на указанном порту
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
