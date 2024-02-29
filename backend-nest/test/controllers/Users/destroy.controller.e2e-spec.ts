import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { TestService } from '../../TestService';
import { UserFactory } from '../../factories/User';

import { UserRole } from '@/entities/Role';
import { RolesRepository } from '@/repositories/RolesRepository';
import { UsersRepository } from '@/repositories/UsersRepository';

describe('Users', () => {
    const testService = new TestService();

    let userFactory;
    let rolesRepository;
    let usersRepository;

    let adminData;
    let employeeData;
    let deletedUser;

    beforeAll(async () => {
        await testService.initTestingEnvironment();
        await testService.truncateDatabase();

        userFactory = new UserFactory(testService);
        rolesRepository = testService.app.get<RolesRepository>(RolesRepository);
        usersRepository = testService.app.get<UsersRepository>(UsersRepository);

        await rolesRepository.insert([
            { name: UserRole.ADMIN },
            { name: UserRole.EMPLOYEE }
        ]);

        adminData = userFactory.generate();
        await userFactory.createAdmin(adminData);

        employeeData = userFactory.generate();
        await userFactory.createEmployee(employeeData);
    });

    beforeEach(async () => {
        deletedUser = await userFactory.createEmployee(userFactory.generate());
    });

    afterAll(async () => {
        await testService.closeApp();
    });

    afterEach(async () => {
        await usersRepository.remove(deletedUser);

        await testService.logout();
    });

    describe('DELETE /users/:id', () => {
        it('returns NO_CONTENT sending valid id as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { id } = deletedUser;
            const { status } = await testService.api.delete(`/users/${id}`);

            expect(status).toBe(HttpStatus.NO_CONTENT);
        });

        it('returns NO_CONTENT sending not existing id as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const id = faker.string.uuid();
            const { status } = await testService.api.delete(`/users/${id}`);

            expect(status).toBe(HttpStatus.NO_CONTENT);
        });

        it('returns NO_CONTENT sending invalid id as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { status } = await testService.api.delete('/users/1234');

            expect(status).toBe(HttpStatus.NO_CONTENT);
        });

        it('returns FORBIDDEN sending request as EMPLOYEE', async () => {
            const { email, password } = employeeData;
            await testService.login({ email, password });

            const { id } = deletedUser;
            const { status } = await testService.api.delete(`/users/${id}`);

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request as NOT LOGGED IN', async () => {
            const { id } = deletedUser;
            const { status } = await testService.api.delete(`/users/${id}`);

            expect(status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
