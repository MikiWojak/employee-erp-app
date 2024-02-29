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
    let editedUser;
    let dataToSend;

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
        editedUser = await userFactory.createEmployee(userFactory.generate());

        dataToSend = userFactory.generate();
        delete dataToSend.password;
    });

    afterAll(async () => {
        await testService.closeApp();
    });

    afterEach(async () => {
        await usersRepository.remove(editedUser);

        await testService.logout();
    });

    const update = (id, data) => {
        return testService.api.put(`/users/${id}`).send(data);
    };

    describe('PUT /users/:id', () => {
        it('returns OK sending valid data including email as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { id } = editedUser;

            const { status, body } = await update(id, dataToSend);

            const { firstName, lastName, dateOfBirth } = dataToSend;

            expect(status).toBe(HttpStatus.OK);
            expect(body).toMatchObject({
                id,
                firstName,
                lastName,
                dateOfBirth,
                email: dataToSend.email
            });
        });

        it('returns OK sending valid data excluding email as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            dataToSend.email = editedUser.email;
            const { id } = editedUser;

            const { status, body } = await update(id, dataToSend);

            const { firstName, lastName, dateOfBirth } = dataToSend;

            expect(status).toBe(HttpStatus.OK);
            expect(body).toMatchObject({
                id,
                firstName,
                lastName,
                dateOfBirth,
                email: editedUser.email
            });
        });

        it('returns BAD_REQUEST sending empty data as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { status } = await update(editedUser.id, {});

            // @TODO Validate error messages
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            dataToSend.dateOfBirth = 'invalid';
            dataToSend.email = 'invalid';

            const { status } = await update(editedUser.id, dataToSend);

            // @TODO Validate error messages
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending taken email as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            dataToSend.email = employeeData.email;

            const { status } = await update(editedUser.id, dataToSend);

            // @TODO Validate error messages
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('returns FORBIDDEN sending valid data as EMPLOYEE', async () => {
            const { email, password } = employeeData;
            await testService.login({ email, password });

            const { status } = await update(editedUser.id, dataToSend);

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it('returns NOT_FOUND sending valid data but not existing id as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const id = faker.string.uuid();

            const { status } = await update(id, dataToSend);

            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it('returns NOT_FOUND sending valid data but invalid id as ADMIN', async () => {
            const { email, password } = adminData;
            await testService.login({ email, password });

            const { status } = await update('1234', dataToSend);

            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it('returns UNAUTHORIZED sending valid data as NOT LOGGED IN', async () => {
            const { status } = await update(editedUser.id, dataToSend);

            expect(status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
