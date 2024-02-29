import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '@/entities/Role';
import { User } from '@/entities/User';
import { UsersService } from '@/services/UsersService';
import { RolesRepository } from '@/repositories/RolesRepository';
import { UsersRepository } from '@/repositories/UsersRepository';
import { ShowController } from '@/controllers/Users/ShowController';
import { StoreContoller } from '@/controllers/Users/StoreContoller';
import { IndexController } from '@/controllers/Users/IndexController';
import { UpdateController } from '@/controllers/Users/UpdateController';
import { DestroyController } from '@/controllers/Users/DestroyController';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    controllers: [
        ShowController,
        StoreContoller,
        IndexController,
        UpdateController,
        DestroyController
    ],
    providers: [UsersRepository, RolesRepository, UsersService]
})
export class UserModule {}
