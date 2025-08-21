import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('School Management')
    .setDescription('The School Management API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors({
  origin: "http://localhost:3000", // Next.js dev server
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
});

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
