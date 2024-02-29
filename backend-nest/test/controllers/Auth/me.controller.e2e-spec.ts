import { HttpStatus } from '@nestjs/common';

import { TestService } from '../../TestService';
import { UserFactory } from '../../factories/User';

import { UserRole } from '@/entities/Role';
import { RolesRepository } from '@/repositories/RolesRepository';

describe('Auth', () => {
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
    });

    afterAll(async () => {
        await testService.closeApp();
    });

    afterEach(async () => {
        await testService.logout();
    });

    describe('GET /auth/me', () => {
        it('returns OK sending request as ADMIN', async () => {
            const { email, password } = adminData;

            await testService.login({ email, password });

            const { status, body } = await testService.api.get('/auth/me');

            expect(status).toBe(HttpStatus.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns OK sending request as EMPLOYEE', async () => {
            const { email, password } = employeeData;

            await testService.login({ email, password });

            const { status, body } = await testService.api.get('/auth/me');

            expect(status).toBe(HttpStatus.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns UNAUTHORIZED sending request as NOT LOGGED IN', async () => {
            const { status } = await testService.api.get('/auth/me');

            expect(status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
