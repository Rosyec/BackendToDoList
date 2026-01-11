import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Función principal de arranque de la aplicación NestJS
 *
 * Esta función asíncrona inicializa la aplicación:
 * 1. Crea la instancia de la aplicación usando NestFactory
 * 2. Configura el puerto de escucha (usa PORT del .env o 3000 por defecto)
 * 3. Inicia el servidor HTTP
 */
async function bootstrap() {
  // Crea la aplicación NestJS con el módulo raíz
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  // Inicia el servidor en el puerto especificado
  await app.listen(process.env.PORT ?? 3000);
}

// Ejecuta la función de arranque
bootstrap();
