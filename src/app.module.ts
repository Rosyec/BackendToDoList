import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

/**
 * Módulo raíz de la aplicación
 *
 * Este módulo importa y configura todos los módulos funcionales:
 * - ConfigModule: Gestiona las variables de entorno (.env)
 * - AuthModule: Maneja autenticación y autorización (JWT)
 * - PrismaModule: Proporciona acceso a la base de datos
 * - TasksModule: CRUD de tareas
 * - UsersModule: Gestión de usuarios
 */
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TasksModule,
    UsersModule,
    // ConfigModule se configura como global para que esté disponible en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
