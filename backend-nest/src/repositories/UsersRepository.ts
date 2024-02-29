import * as deepmerge from 'deepmerge';
import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { isPlainObject } from 'is-plain-object';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@/entities/User';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        repository: Repository<User>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    findByEmail(email: string, options = {}) {
        const args = deepmerge(
            options,
            { where: { email: Equal(email) } },
            { isMergeableObject: isPlainObject }
        );

        return this.findOne(args);
    }

    findById(id: string, options = {}) {
        const args = deepmerge(
            options,
            { where: { id: Equal(id) } },
            { isMergeableObject: isPlainObject }
        );

        return this.findOne(args);
    }

    getById(id: string, options = {}) {
        const args = deepmerge(
            options,
            {
                relations: {
                    role: true
                }
            },
            { isMergeableObject: isPlainObject }
        );

        return this.findById(id, args);
    }
}
