import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { TestService } from '../../TestService';
import { UserFactory } from '../../factories/User';

import { UserRole } from '@/entities/Role';
import { RolesRepository } from '@/repositories/RolesRepository';

describe('Users', () => {
    const testService = new TestService();

    let adminData;
    let employeeData;
    let fetchedUser;

    beforeAll(async () => {
        await testService.initTestingEnvironment();
        await testService.truncateDatabase();

        const userFactory = new UserFactory(testService);

        const rolesRepository =
            testService.app.get<RolesRepository>(RolesRepository);
        await rolesRepository.insert([
            { name: UserRole.ADMIN },
            { name: UserRole.EMPLOYEE }
        ]);

        adminData = userFactory.generate();
        await userFactory.createAdmin(adminData);

        employeeData = userFactory.generate();
        await userFactory.createEmployee(employeeData);

        fetchedUser = await userFactory.createEmployee(userFactory.generate());
    });

    afterAll(async () => {
        await testService.closeApp();
    });

    afterEach(async () => {
        await testService.logout();
    });

    describe('GET /users/:id', () => {
        it('returns OK sending valid id as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { id } = fetchedUser;
            const { status, body } = await testService.api.get(`/users/${id}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toHaveProperty('id', id);
        });

        it('returns FORBIDDEN sending request as EMPLOYEE', async () => {
            const { email, password } = employeeData;
            await testService.login({ email, password });

            const { id } = fetchedUser;
            const { status } = await testService.api.get(`/users/${id}`);

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it('returns NOT_FOUND sending not existing id as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const id = faker.string.uuid();
            const { status } = await testService.api.get(`/users/${id}`);

            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it('returns NOT_FOUND sending invalid id as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { status } = await testService.api.get('/users/1234');

            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it('returns UNAUTHORIZED sending request as NOT LOGGED IN', async () => {
            const { id } = fetchedUser;
            const { status } = await testService.api.get(`/users/${id}`);

            expect(status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
