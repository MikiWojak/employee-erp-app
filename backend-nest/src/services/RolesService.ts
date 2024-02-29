import { Injectable } from '@nestjs/common';

import { RolesRepository } from '@/repositories/RolesRepository';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) {}

    truncate() {
        return this.rolesRepository.delete({});
    }
}
