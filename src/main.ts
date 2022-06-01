import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configuration from './core/shared/config/configuration';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle(configuration().swagger.title)
    .setDescription(configuration().swagger.description)
    .setContact(
      configuration().swagger.contacts.email,
      configuration().swagger.contacts.site_web,
      configuration().swagger.contacts.facebook,
    )
    .setVersion(configuration().swagger.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configuration().swagger.url, app, document);

  app.enableCors();
  app.use(compression());
  app.setGlobalPrefix(configuration().setGlobalPrefix);
  await app.listen(configuration().port);
}
bootstrap();
