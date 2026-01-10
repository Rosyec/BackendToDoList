import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Servicio de Usuarios
 *
 * Maneja las operaciones de base de datos relacionadas con usuarios.
 * Este servicio es utilizado principalmente por AuthService para:
 * - Buscar usuarios por email (login)
 * - Crear nuevos usuarios (registro)
 * - Obtener información del perfil
 */
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Busca un usuario por su ID
     *
     * @param id - ID del usuario
     * @returns Usuario sin la contraseña (solo datos públicos)
     *
     * Nota: Excluye el campo password por seguridad
     */
    async findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                // password: false (excluido por seguridad)
            },
        });
    }

    /**
     * Busca un usuario por su email
     *
     * @param email - Email del usuario
     * @returns Usuario completo (incluye password para validación)
     *
     * Nota: Este método SÍ retorna el password porque se usa para autenticación
     */
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Crea un nuevo usuario en la base de datos
     *
     * @param data - Datos del usuario (email, password hasheado, name)
     * @returns Usuario creado
     *
     * Nota: La contraseña debe venir ya hasheada desde AuthService
     */
    async create(data: any) {
        return this.prisma.user.create({
            data,
        });
    }
}
