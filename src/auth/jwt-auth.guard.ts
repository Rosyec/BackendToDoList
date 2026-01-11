import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from './jwt-config.service';

/**
 * Interfaz del usuario autenticado
 * Define la estructura del objeto usuario que se adjunta a la request
 */
export interface AuthenticatedUser {
    userId: number;   // ID del usuario
    email: string;    // Email del usuario
}

/**
 * Guard de Autenticación JWT
 *
 * Este guard protege rutas requiriendo un token JWT válido.
 * Implementación estándar de NestJS sin dependencias de Passport.
 *
 * Uso:
 * - A nivel de controlador: @UseGuards(JwtAuthGuard) antes de @Controller()
 * - A nivel de método: @UseGuards(JwtAuthGuard) antes de @Get(), @Post(), etc.
 *
 * Proceso:
 * 1. Extrae el token del header Authorization: Bearer <token>
 * 2. Verifica la firma del token usando JWT_SECRET
 * 3. Valida que el token no haya expirado
 * 4. Adjunta el usuario decodificado a req.user
 * 5. Si es inválido, retorna 401 Unauthorized
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private jwtConfigService: JwtConfigService,
    ) { }

    /**
     * Método principal del guard que valida la autenticación
     *
     * @param context - Contexto de ejecución de NestJS
     * @returns true si el token es válido, false o lanza excepción si no
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token no proporcionado');
        }

        try {
            // Obtiene el secreto JWT desde el servicio de configuración
            const secret = this.jwtConfigService.getSecret();

            // Verifica y decodifica el token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: secret,
            });

            // Valida que el payload contenga los datos requeridos
            if (!payload.sub || !payload.email) {
                throw new UnauthorizedException('Token inválido: datos incompletos');
            }

            // Adjunta el usuario a la request para uso en controladores
            request.user = {
                userId: payload.sub,
                email: payload.email,
            } as AuthenticatedUser;

        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }

        return true;
    }

    /**
     * Extrae el token JWT del header Authorization
     *
     * @param request - Objeto request de Express
     * @returns Token JWT o undefined si no existe
     * @private
     */
    private extractTokenFromHeader(request: any): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return undefined;
        }

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}
