import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

/**
 * Controlador de Autenticación
 *
 * Expone los endpoints HTTP para autenticación:
 * - POST /auth/register: Registro de nuevos usuarios
 * - POST /auth/login: Inicio de sesión
 *
 * Estos endpoints son públicos (no requieren autenticación)
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Endpoint de registro de usuarios
     *
     * @param dto - Datos del nuevo usuario (email, password, name)
     * @returns Token JWT para autenticación inmediata
     *
     * POST /auth/register
     * Body: { email: string, password: string, name: string }
     */
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    /**
     * Endpoint de inicio de sesión
     *
     * @param dto - Credenciales del usuario (email, password)
     * @returns Token JWT para autenticación
     *
     * POST /auth/login
     * Body: { email: string, password: string }
     */
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
