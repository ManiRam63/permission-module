import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { config } from 'dotenv';

config();

function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Permissions-Module')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
}

export function setupSwagger(app: INestApplication) {
  return SwaggerModule.setup(
    'APIs',
    app,
    SwaggerModule.createDocument(app, getSwaggerConfig()),
  );
}
