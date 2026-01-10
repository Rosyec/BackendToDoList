import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtMiddlewareService } from './jwt.middleware.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        PassportModule,
        JwtModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtMiddlewareService],
    exports: [AuthService],
})
export class AuthModule { }