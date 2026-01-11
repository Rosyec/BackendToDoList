import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Servicio de Configuración JWT
 *
 * Centraliza toda la lógica relacionada con la firma y configuración de tokens JWT.
 * Proporciona métodos para generar tokens con la configuración adecuada.
 */
@Injectable()
export class JwtConfigService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    /**
     * Genera un token JWT firmado
     *
     * @param userId - ID del usuario
     * @param email - Email del usuario
     * @returns Objeto con el access_token
     * @throws Error si JWT_SECRET no está definido
     */
    generateToken(userId: number, email: string): { access_token: string } {
        // Obtiene el secreto JWT desde las variables de entorno
        const secret = this.configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT_SECRET must be defined in environment variables');
        }

        // Payload del token: contiene el ID del usuario (sub) y email
        const payload = { sub: userId, email };

        // Firma el token con el secreto y establece expiración de 1 hora
        return {
            access_token: this.jwtService.sign(payload, {
                secret: secret,
                expiresIn: '60m', // Los tokens expiran en 1 hora
            }),
        };
    }

    /**
     * Obtiene el secreto JWT desde las variables de entorno
     *
     * @returns El secreto JWT
     * @throws Error si JWT_SECRET no está definido
     */
    getSecret(): string {
        const secret = this.configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT_SECRET must be defined in environment variables');
        }

        return secret;
    }
}
