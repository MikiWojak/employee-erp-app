import { Get, Query, Controller, UseGuards } from '@nestjs/common';

import { Roles } from '@/decorators/Roles';
import { UserRole } from '@/entities/Role';
import { RolesGuard } from '@/guards/RolesGuard';
import { UsersService } from '@/services/UsersService';
import { SortingQueryDto } from '@/dto/SortingQueryDto';
import { ParseSortingPipe } from '@/pipes/ParseSortingPipe';
import { PaginationQueryDto } from '@/dto/PaginationQueryDto';
import { ParsePaginationPipe } from '@/pipes/ParsePaginationPipe';

@Controller('users')
export class IndexController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    invoke(
        @Query(ParseSortingPipe)
        sortingQuery: SortingQueryDto,
        @Query(ParsePaginationPipe)
        paginationQuery: PaginationQueryDto
    ) {
        return this.usersService.findAndCountAll(sortingQuery, paginationQuery);
    }
}
