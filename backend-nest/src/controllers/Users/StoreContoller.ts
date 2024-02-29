import { Post, Controller, UseGuards, Body } from '@nestjs/common';

import { Roles } from '@/decorators/Roles';
import { UserRole } from '@/entities/Role';
import { RolesGuard } from '@/guards/RolesGuard';
import { StoreUserDto } from '@/dto/StoreUserDto';
import { UsersService } from '@/services/UsersService';
import { EmailInUsePipe } from '@/pipes/EmailInUsePipe';

@Controller('users')
export class StoreContoller {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    invoke(
        @Body() storeUserDto: StoreUserDto,
        @Body('email', EmailInUsePipe) email
    ) {
        return this.usersService.store(storeUserDto);
    }
}
