import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

/**
 * Servicio de Autenticación
 *
 * Maneja toda la lógica de negocio relacionada con autenticación:
 * - Registro de nuevos usuarios con hash de contraseñas
 * - Login y validación de credenciales
 * - Generación de tokens JWT
 *
 * Utiliza bcrypt para el hash seguro de contraseñas
 * Utiliza JWT para autenticación stateless
 */
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    /**
     * Registra un nuevo usuario en el sistema
     *
     * @param dto - Datos del usuario (email, password, name)
     * @returns Token JWT de acceso
     * @throws ConflictException si el email ya está en uso
     */
    async register(dto: RegisterDto) {
        // Verifica si el email ya existe en la base de datos
        const existingUser = await this.usersService.findByEmail(dto.email);

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        // Genera un salt aleatorio para el hash
        const salt = await bcrypt.genSalt();
        // Hashea la contraseña con el salt generado
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        // Crea el usuario en la base de datos con la contraseña hasheada
        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
        });

        // Genera y retorna el token JWT
        return this.generateToken(user.id, user.email);
    }

    /**
     * Autentica un usuario existente
     *
     * @param dto - Credenciales del usuario (email, password)
     * @returns Token JWT de acceso
     * @throws UnauthorizedException si las credenciales son inválidas
     */
    async login(dto: LoginDto) {
        // Busca el usuario por email
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Compara la contraseña ingresada con el hash almacenado
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Genera y retorna el token JWT
        return this.generateToken(user.id, user.email);
    }

    /**
     * Genera un token JWT firmado
     *
     * @param userId - ID del usuario
     * @param email - Email del usuario
     * @returns Objeto con el access_token
     * @throws Error si JWT_SECRET no está definido
     * @private
     */
    private generateToken(userId: number, email: string) {
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
}
