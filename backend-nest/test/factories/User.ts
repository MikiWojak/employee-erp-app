import * as dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

import { TestService } from '../TestService';

import { UserRole } from '@/entities/Role';
import { RolesRepository } from '@/repositories/RolesRepository';
import { UsersRepository } from '@/repositories/UsersRepository';

export class UserFactory {
    private rolesRepository: RolesRepository;
    private usersRepository: UsersRepository;

    constructor(private readonly testService: TestService) {
        this.rolesRepository =
            this.testService.app.get<RolesRepository>(RolesRepository);
        this.usersRepository =
            this.testService.app.get<UsersRepository>(UsersRepository);
    }

    generate() {
        const firstName = faker.person.firstName('male');
        const lastName = faker.person.lastName('male');

        return {
            firstName,
            lastName,
            dateOfBirth: dayjs(
                faker.date.between({
                    from: dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
                    to: dayjs().subtract(18, 'year').format('YYYY-MM-DD')
                })
            ).format('YYYY-MM-DD'),
            email: faker.internet
                .email({
                    firstName,
                    lastName
                })
                .toLowerCase(),
            password: faker.internet.password()
        };
    }

    async createAdmin(props) {
        const role = await this.rolesRepository.findOneBy({
            name: UserRole.ADMIN
        });

        const admin = await this.usersRepository.create({
            ...props,
            role
        });

        return this.usersRepository.save(admin);
    }

    async createEmployee(props) {
        const role = await this.rolesRepository.findOneBy({
            name: UserRole.EMPLOYEE
        });

        const employee = await this.usersRepository.create({
            ...props,
            role
        });

        return this.usersRepository.save(employee);
    }
}
