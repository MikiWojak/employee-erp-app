import {
    Injectable,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { DataSource, FindManyOptions } from 'typeorm';

import { UserRole } from '@/entities/Role';
import { StoreUserDto } from '@/dto/StoreUserDto';
import { UpdateUserDto } from '@/dto/UpdateUserDto';
import { SortingQueryDto } from '@/dto/SortingQueryDto';
import { PaginationQueryDto } from '@/dto/PaginationQueryDto';
import { RolesRepository } from '@/repositories/RolesRepository';
import { UsersRepository } from '@/repositories/UsersRepository';

@Injectable()
export class UsersService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly rolesRepository: RolesRepository,
        private readonly usersRepository: UsersRepository
    ) {}

    #findEmployeeById(id: string) {
        return this.usersRepository.getById(id, {
            where: {
                role: {
                    name: UserRole.EMPLOYEE
                }
            }
        });
    }

    async findAndCountAll(
        sortingQuery: SortingQueryDto,
        paginationQuery: PaginationQueryDto
    ) {
        const { order } = sortingQuery;
        const { skip, take, fetchAll } = paginationQuery;

        const options: FindManyOptions = {
            where: {
                role: {
                    name: UserRole.EMPLOYEE
                }
            },
            relations: {
                role: true
            },
            order
        };

        if (!fetchAll) {
            options.skip = skip;
            options.take = take;
        }

        const [rows, count] = await this.usersRepository.findAndCount(options);

        return {
            rows,
            count
        };
    }

    async show(id: string) {
        const user = await this.#findEmployeeById(id);

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    async store(storeUserDto: StoreUserDto) {
        const role = await this.rolesRepository.findByName(UserRole.EMPLOYEE);

        const userCreated = await this.usersRepository.create({
            ...storeUserDto,
            role
        });

        const { id } = await this.usersRepository.save(userCreated);

        return this.usersRepository.getById(id);
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        // @TODO Move checking if email is taken outside of controller
        const existingUser = await this.usersRepository.findByEmail(
            updateUserDto.email
        );

        if (existingUser && existingUser.id !== id) {
            throw new BadRequestException(['email is already in use']);
        }

        const user = await this.#findEmployeeById(id);

        if (!user) {
            throw new NotFoundException();
        }

        await this.usersRepository.save({
            ...user,
            ...updateUserDto
        });

        return this.usersRepository.getById(id);
    }

    async destroy(id: string) {
        const user = await this.#findEmployeeById(id);

        if (!user) {
            return;
        }

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const timestamp = dayjs().unix();
            const email = `${user.email}_${timestamp}`;

            user.email = email;

            await queryRunner.manager.save(user);
            await queryRunner.manager.softRemove(user);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    truncate() {
        return this.usersRepository.delete({});
    }
}
