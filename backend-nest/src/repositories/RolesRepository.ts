import { Repository } from 'typeorm';
import * as deepmerge from 'deepmerge';
import { Injectable } from '@nestjs/common';
import { isPlainObject } from 'is-plain-object';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '@/entities/Role';
import { UserRole } from '@/entities/Role';

@Injectable()
export class RolesRepository extends Repository<Role> {
    constructor(
        @InjectRepository(Role)
        repository: Repository<Role>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    findByName(name: UserRole, options = {}) {
        const args = deepmerge(
            options,
            { where: { name } },
            { isMergeableObject: isPlainObject }
        );

        return this.findOne(args);
    }
}
