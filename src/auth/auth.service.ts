import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
        });

        return this.generateToken(user.id, user.email);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user.id, user.email);
    }

    private generateToken(userId: number, email: string) {
        const secret = this.configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT_SECRET must be defined in environment variables');
        }

        const payload = { sub: userId, email };

        return {
            access_token: this.jwtService.sign(payload, {
                secret: secret,
                expiresIn: '60m', // Los tokens expiran en 1 hora
            }),
        };
    }
}
