import {
    Param,
    Delete,
    Response,
    UseGuards,
    Controller,
    HttpStatus
} from '@nestjs/common';

import { Roles } from '@/decorators/Roles';
import { UserRole } from '@/entities/Role';
import { RolesGuard } from '@/guards/RolesGuard';
import { UsersService } from '@/services/UsersService';

@Controller('users')
export class DestroyController {
    constructor(private readonly usersService: UsersService) {}

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async invoke(@Param('id') id: string, @Response() response) {
        await this.usersService.destroy(id);

        response.status(HttpStatus.NO_CONTENT).send();
    }
}
