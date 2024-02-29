import { HttpStatus } from '@nestjs/common';

import { TestService } from '../../TestService';
import { UserFactory } from '../../factories/User';

import { UserRole } from '@/entities/Role';
import { RolesRepository } from '@/repositories/RolesRepository';

describe('Users', () => {
    const testService = new TestService();

    let userFactory;

    let adminData;
    let employeeData;
    let dataToSend;

    beforeAll(async () => {
        await testService.initTestingEnvironment();
        await testService.truncateDatabase();

        userFactory = new UserFactory(testService);

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

    beforeEach(() => {
        dataToSend = userFactory.generate();
    });

    afterAll(async () => {
        await testService.closeApp();
    });

    afterEach(async () => {
        await testService.logout();
    });

    const store = data => {
        return testService.api.post('/users').send(data);
    };

    describe('POST /users', () => {
        it('returns CREATED sending valid data as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { status, body } = await store(dataToSend);

            const { firstName, lastName, dateOfBirth } = dataToSend;

            expect(status).toBe(HttpStatus.CREATED);
            expect(body).toMatchObject({
                firstName,
                lastName,
                dateOfBirth,
                email: dataToSend.email
            });
        });

        it('returns BAD_REQUEST sending empty data as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { status } = await store({});

            // @TODO Validate error messages
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            dataToSend.dateOfBirth = 'invalid';
            dataToSend.email = 'invalid';
            dataToSend.password = 'p';

            const { status } = await store(dataToSend);

            // @TODO Validate error messages
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending taken email as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            dataToSend.email = employeeData.email;

            const { status } = await store(dataToSend);

            // @TODO Validate error messages
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('returns FORBIDDEN sending valid data as EMPLOYEE', async () => {
            const { email, password } = employeeData;
            await testService.login({ email, password });

            const { status } = await store(dataToSend);

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending valid data as NOT LOGGED IN', async () => {
            const { status } = await store(dataToSend);

            expect(status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
