import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard de Autenticación JWT
 *
 * Este guard protege rutas requiriendo un token JWT válido.
 * Extiende AuthGuard de Passport usando la estrategia 'jwt'.
 *
 * Uso:
 * - A nivel de controlador: @UseGuards(JwtAuthGuard) antes de @Controller()
 * - A nivel de método: @UseGuards(JwtAuthGuard) antes de @Get(), @Post(), etc.
 *
 * Cuando se aplica:
 * 1. Extrae el token del header Authorization
 * 2. Ejecuta JwtMiddlewareService.validate()
 * 3. Si es válido, adjunta req.user y permite el acceso
 * 4. Si es inválido, retorna 401 Unauthorized
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
