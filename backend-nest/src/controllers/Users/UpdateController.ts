import { Put, Controller, UseGuards, Param, Body } from '@nestjs/common';

import { Roles } from '@/decorators/Roles';
import { UserRole } from '@/entities/Role';
import { RolesGuard } from '@/guards/RolesGuard';
import { UpdateUserDto } from '@/dto/UpdateUserDto';
import { UsersService } from '@/services/UsersService';

@Controller('users')
export class UpdateController {
    constructor(private readonly usersService: UsersService) {}

    @Put(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    invoke(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
}
