import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async findAll(userId: number) {
        return this.prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(userId: number, id: number) {
        const task = await this.prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    async update(userId: number, id: number, dto: UpdateTaskDto) {
        // Check if task exists and belongs to user
        await this.findOne(userId, id);

        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    async remove(userId: number, id: number) {
        // Check if task exists and belongs to user
        await this.findOne(userId, id);

        return this.prisma.task.delete({
            where: { id },
        });
    }
}
