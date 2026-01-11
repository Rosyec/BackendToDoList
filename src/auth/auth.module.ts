import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtConfigService } from './jwt-config.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

/**
 * Módulo de Autenticación
 *
 * Configura JWT usando la implementación estándar de NestJS sin Passport.
 * El JwtModule se configura de forma asíncrona para obtener el secret desde ConfigService.
 * JwtConfigService centraliza la lógica de firma de tokens.
 * Exporta JwtModule para que otros módulos puedan usar JwtService en el guard.
 */
@Module({
    imports: [
        PrismaModule,
        forwardRef(() => UsersModule),
        ConfigModule,
        // Configuración asíncrona de JwtModule para usar variables de entorno
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '60m', // Los tokens expiran en 1 hora
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, JwtConfigService],
    exports: [AuthService, JwtAuthGuard, JwtConfigService, JwtModule],
})
export class AuthModule { }