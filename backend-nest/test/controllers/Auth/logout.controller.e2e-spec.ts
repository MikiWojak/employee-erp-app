import { HttpStatus } from '@nestjs/common';

import { TestService } from '../../TestService';
import { UserFactory } from '../../factories/User';

import { UserRole } from '@/entities/Role';
import { RolesRepository } from '@/repositories/RolesRepository';

describe('Auth', () => {
    const testService = new TestService();

    let adminData;

    beforeAll(async () => {
        await testService.initTestingEnvironment();
        await testService.truncateDatabase();

        const userFactory = new UserFactory(testService);

        const rolesRepository =
            testService.app.get<RolesRepository>(RolesRepository);
        await rolesRepository.insert([{ name: UserRole.ADMIN }]);

        adminData = userFactory.generate();
        await userFactory.createAdmin(adminData);
    });

    afterAll(async () => {
        await testService.closeApp();
    });

    afterEach(async () => {
        await testService.logout();
    });

    describe('POST /auth/logout', () => {
        it('returns NO_CONTENT sending request as ADMIN', async () => {
            const { email, password } = adminData;

            await testService.login({
                email,
                password
            });

            const { status } = await testService.logout();

            expect(status).toBe(HttpStatus.NO_CONTENT);
        });

        it('returns NO_CONTENT sending request as NOT LOGGED IN', async () => {
            const { status } = await testService.logout();

            expect(status).toBe(HttpStatus.NO_CONTENT);
        });
    });
});
