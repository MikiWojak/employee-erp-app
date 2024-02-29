import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/User';
import { AuthService } from '@/services/AuthService';
import { LoginHandler } from '@/services/Auth/LoginHandler';
import { MeController } from '@/controllers/Auth/MeController';
import { UsersRepository } from '@/repositories/UsersRepository';
import { LoginController } from '@/controllers/Auth/LoginController';
import { LogoutController } from '@/controllers/Auth/LogoutController';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [MeController, LoginController, LogoutController],
    providers: [LoginHandler, AuthService, UsersRepository]
})
export class AuthModule {}
