import { Get, Controller, UseGuards, Param } from '@nestjs/common';

import { Roles } from '@/decorators/Roles';
import { UserRole } from '@/entities/Role';
import { RolesGuard } from '@/guards/RolesGuard';
import { UsersService } from '@/services/UsersService';

@Controller('users')
export class ShowController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    invoke(@Param('id') id: string) {
        return this.usersService.show(id);
    }
}
