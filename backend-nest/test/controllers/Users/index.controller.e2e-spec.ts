import { HttpStatus } from '@nestjs/common';

import { TestService } from '../../TestService';
import { UserFactory } from '../../factories/User';

import { UserRole } from '@/entities/Role';
import { RolesRepository } from '@/repositories/RolesRepository';

describe('Users', () => {
    const testService = new TestService();

    let adminData;
    let employeeData;

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

        await userFactory.createEmployee(userFactory.generate());
    });

    afterAll(async () => {
        await testService.closeApp();
    });

    afterEach(async () => {
        await testService.logout();
    });

    describe('GET /users', () => {
        it('returns OK sending request as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { status, body } = await testService.api.get('/users');

            expect(status).toBe(HttpStatus.OK);
            expect(body.rows.length).toBe(2);
        });

        it('returns FORBIDDEN sending request as EMPLOYEE', async () => {
            const { email, password } = employeeData;
            await testService.login({ email, password });

            const { status } = await testService.api.get('/users');

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request as NOT LOGGED IN', async () => {
            const { status } = await testService.api.get('/users');

            expect(status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
