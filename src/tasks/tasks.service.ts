import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

/**
 * Servicio de Tareas (ToDo)
 *
 * Maneja toda la lógica de negocio del CRUD de tareas:
 * - Crear nuevas tareas
 * - Listar tareas del usuario
 * - Obtener una tarea específica
 * - Actualizar tareas (título, descripción, estado)
 * - Eliminar tareas
 *
 * IMPORTANTE: Todas las operaciones están scoped por usuario.
 * Un usuario solo puede ver/modificar sus propias tareas.
 */
@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    /**
     * Crea una nueva tarea para el usuario
     *
     * @param userId - ID del usuario propietario
     * @param dto - Datos de la tarea (title, description)
     * @returns Tarea creada con status PENDING por defecto
     */
    async create(userId: number, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                ...dto,
                userId, // Asocia la tarea al usuario autenticado
            },
        });
    }

    /**
     * Obtiene todas las tareas del usuario
     *
     * @param userId - ID del usuario
     * @returns Array de tareas ordenadas por fecha de creación (más recientes primero)
     */
    async findAll(userId: number) {
        return this.prisma.task.findMany({
            where: { userId }, // Solo tareas del usuario
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Obtiene una tarea específica del usuario
     *
     * @param userId - ID del usuario
     * @param id - ID de la tarea
     * @returns Tarea encontrada
     * @throws NotFoundException si la tarea no existe o no pertenece al usuario
     */
    async findOne(userId: number, id: number) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,      // ID de la tarea
                userId   // Debe pertenecer al usuario
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    /**
     * Actualiza una tarea del usuario
     *
     * @param userId - ID del usuario
     * @param id - ID de la tarea
     * @param dto - Datos a actualizar (title, description, status)
     * @returns Tarea actualizada
     * @throws NotFoundException si la tarea no existe o no pertenece al usuario
     */
    async update(userId: number, id: number, dto: UpdateTaskDto) {
        // Verifica que la tarea existe y pertenece al usuario
        await this.findOne(userId, id);

        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    /**
     * Elimina una tarea del usuario
     *
     * @param userId - ID del usuario
     * @param id - ID de la tarea
     * @returns Tarea eliminada
     * @throws NotFoundException si la tarea no existe o no pertenece al usuario
     */
    async remove(userId: number, id: number) {
        // Verifica que la tarea existe y pertenece al usuario
        await this.findOne(userId, id);

        return this.prisma.task.delete({
            where: { id },
        });
    }
}
