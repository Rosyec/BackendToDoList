import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Interfaz del payload del token JWT
 * Define la estructura de los datos contenidos en el token
 */
interface JwtPayload {
    sub: number;      // ID del usuario (subject)
    email: string;    // Email del usuario
    iat?: number;     // Timestamp de emisión (issued at)
    exp?: number;     // Timestamp de expiración
}

/**
 * Interfaz del usuario autenticado
 * Define la estructura del objeto usuario que se adjunta a la request
 */
export interface AuthenticatedUser {
    userId: number;   // ID del usuario
    email: string;    // Email del usuario
}

/**
 * Estrategia JWT de Passport
 *
 * Este servicio configura y valida los tokens JWT en las peticiones protegidas.
 * Se ejecuta automáticamente cuando se usa el JwtAuthGuard.
 *
 * Proceso:
 * 1. Extrae el token del header Authorization: Bearer <token>
 * 2. Verifica la firma del token usando JWT_SECRET
 * 3. Valida que el token no haya expirado
 * 4. Ejecuta el método validate() con el payload decodificado
 * 5. El resultado se adjunta a req.user
 */
@Injectable()
export class JwtMiddlewareService extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        // Obtiene el secreto JWT desde las variables de entorno
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT_SECRET must be defined in environment variables');
        }

        // Configura la estrategia de Passport
        super({
            // Extrae el token del header Authorization: Bearer <token>
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            // No ignora tokens expirados (los rechaza automáticamente)
            ignoreExpiration: false,

            // Secreto para verificar la firma del token
            secretOrKey: secret,
        });
    }

    /**
     * Valida el payload del token JWT
     *
     * Este método se ejecuta después de que Passport verifica la firma del token.
     * Aquí puedes agregar validaciones adicionales (ej: verificar si el usuario existe).
     *
     * @param payload - Datos decodificados del token JWT
     * @returns Objeto usuario que se adjuntará a req.user
     * @throws UnauthorizedException si el payload es inválido
     */
    async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
        // Valida que el payload contenga los datos requeridos
        if (!payload.sub || !payload.email) {
            throw new UnauthorizedException('Token inválido: datos incompletos');
        }

        // Retorna el objeto usuario que se adjuntará a req.user
        return {
            userId: payload.sub,
            email: payload.email,
        };
    }
}