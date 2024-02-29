import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '@/entities/Role';
import { RolesService } from '@/services/RolesService';
import { RolesRepository } from '@/repositories/RolesRepository';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    providers: [RolesRepository, RolesService]
})
export class RoleModule {}
