import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../prisma/generated/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Servicio de Prisma para gestionar la conexión a la base de datos
 *
 * Este servicio extiende PrismaClient y gestiona el ciclo de vida de la conexión:
 * - Implementa OnModuleInit para conectar al iniciar el módulo
 * - Implementa OnModuleDestroy para desconectar al destruir el módulo
 * - Usa el adaptador de PostgreSQL (@prisma/adapter-pg) para Prisma 7
 *
 * La conexión se configura usando DATABASE_URL del archivo .env
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(private readonly configService: ConfigService) {
        // Obtiene la URL de conexión desde las variables de entorno
        const connectionString = configService.get<string>('DATABASE_URL');

        // Crea el adaptador de PostgreSQL (requerido en Prisma 7)
        const adapter = new PrismaPg({ connectionString });

        // Inicializa PrismaClient con el adaptador
        super({ adapter });
    }

    /**
     * Hook del ciclo de vida: se ejecuta cuando el módulo se inicializa
     * Establece la conexión con la base de datos
     */
    async onModuleInit() {
        await this.$connect();
    }

    /**
     * Hook del ciclo de vida: se ejecuta cuando el módulo se destruye
     * Cierra la conexión con la base de datos de forma limpia
     */
    async onModuleDestroy() {
        await this.$disconnect();
    }
}