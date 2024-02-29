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

    describe('POST /auth/login', () => {
        it('returns OK sending valid data as NOT LOGGED IN', async () => {
            const { email, password } = adminData;

            const { status, body } = await testService.login({
                email,
                password
            });

            expect(status).toBe(HttpStatus.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns OK sending valid data as EMPLOYEE', async () => {
            const { email: employeeEmail, password: employeePassword } =
                employeeData;

            await testService.login({
                email: employeeEmail,
                password: employeePassword
            });

            const { email, password } = adminData;

            const { status, body } = await testService.login({
                email,
                password
            });

            expect(status).toBe(HttpStatus.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns BAD_REQUEST sending empty data as NOT LOGGED IN', async () => {
            const { status } = await testService.login({
                email: '',
                password: ''
            });

            // @TODO Validate error messages
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data as NOT LOGGED IN', async () => {
            const { status } = await testService.login({
                email: 'invalid',
                password: 'p'
            });

            // @TODO Validate error messages
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('returns UNAUTHORIZED sending mismatching email as NOT LOGGED IN', async () => {
            const { email, password } = adminData;

            const { status } = await testService.login({
                email: `a${email}`,
                password
            });

            expect(status).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('returns UNAUTHORIZED sending mismatching password as NOT LOGGED IN', async () => {
            const { email, password } = adminData;

            const { status } = await testService.login({
                email,
                password: `a${password}`
            });

            expect(status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
