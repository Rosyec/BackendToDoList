import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtConfigService } from './jwt-config.service';
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
 * Utiliza JwtConfigService para la generación de tokens JWT
 */
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtConfigService: JwtConfigService,
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

        // Genera el token JWT
        const token = this.generateToken(user.id, user.email);

        // Retorna el usuario (sin password) y el token
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            ...token,
        };
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

        // Genera el token JWT
        const token = this.generateToken(user.id, user.email);

        // Retorna el usuario (sin password) y el token
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            ...token,
        };
    }

    /**
     * Genera un token JWT firmado
     *
     * @param userId - ID del usuario
     * @param email - Email del usuario
     * @returns Objeto con el access_token
     * @private
     */
    private generateToken(userId: number, email: string) {
        return this.jwtConfigService.generateToken(userId, email);
    }
}
