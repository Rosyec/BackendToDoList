import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../prisma/generated/client';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}
