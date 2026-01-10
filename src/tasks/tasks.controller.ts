import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controlador de Tareas (ToDo)
 *
 * Expone los endpoints HTTP para el CRUD de tareas.
 * TODAS las rutas requieren autenticación (JwtAuthGuard a nivel de controlador).
 *
 * El usuario autenticado se obtiene de req.user (inyectado por JwtAuthGuard)
 *
 * Endpoints:
 * - POST   /tasks       - Crear tarea
 * - GET    /tasks       - Listar todas las tareas del usuario
 * - GET    /tasks/:id   - Obtener una tarea específica
 * - PATCH  /tasks/:id   - Actualizar tarea
 * - DELETE /tasks/:id   - Eliminar tarea
 */
@UseGuards(JwtAuthGuard) // Protege TODAS las rutas de este controlador
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    /**
     * Crea una nueva tarea
     *
     * @param req - Request con usuario autenticado (req.user)
     * @param createTaskDto - Datos de la tarea
     * @returns Tarea creada
     *
     * POST /tasks
     * Headers: Authorization: Bearer <token>
     * Body: { title: string, description?: string }
     */
    @Post()
    create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(req.user.userId, createTaskDto);
    }

    /**
     * Lista todas las tareas del usuario autenticado
     *
     * @param req - Request con usuario autenticado
     * @returns Array de tareas
     *
     * GET /tasks
     * Headers: Authorization: Bearer <token>
     */
    @Get()
    findAll(@Request() req) {
        return this.tasksService.findAll(req.user.userId);
    }

    /**
     * Obtiene una tarea específica
     *
     * @param req - Request con usuario autenticado
     * @param id - ID de la tarea
     * @returns Tarea encontrada
     *
     * GET /tasks/:id
     * Headers: Authorization: Bearer <token>
     */
    @Get(':id')
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.tasksService.findOne(req.user.userId, id);
    }

    /**
     * Actualiza una tarea
     *
     * @param req - Request con usuario autenticado
     * @param id - ID de la tarea
     * @param updateTaskDto - Datos a actualizar
     * @returns Tarea actualizada
     *
     * PATCH /tasks/:id
     * Headers: Authorization: Bearer <token>
     * Body: { title?: string, description?: string, status?: TaskStatus }
     */
    @Patch(':id')
    update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(req.user.userId, id, updateTaskDto);
    }

    /**
     * Elimina una tarea
     *
     * @param req - Request con usuario autenticado
     * @param id - ID de la tarea
     * @returns Tarea eliminada
     *
     * DELETE /tasks/:id
     * Headers: Authorization: Bearer <token>
     */
    @Delete(':id')
    remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.tasksService.remove(req.user.userId, id);
    }
}
