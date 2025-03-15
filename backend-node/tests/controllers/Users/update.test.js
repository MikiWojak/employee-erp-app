const faker = require('faker');
const server = require('../../../src/index');
const request = require('supertest-session')(server);
const { StatusCodes: HTTP } = require('http-status-codes');

const { Role } = require('../../../src/models');

const di = require('../../../src/di');
const { sequelize } = di.get('sequelize');
const roleRepository = di.get('repositories.role');
const redisSessionClient = di.get('redisSessionClient');

const UserFactory = require('../../factories/User');

const login = require('../../helpers/login');
const truncateDatabase = require('../../helpers/truncateDatabase');

let admin, employee;

describe('Users', () => {
    let editedUser;
    let dataToSend;

    beforeAll(async () => {
        await truncateDatabase();

        await roleRepository.create({ name: Role.ADMIN });
        await roleRepository.create({ name: Role.EMPLOYEE });

        admin = UserFactory.generate();
        await UserFactory.createAdmin(admin);

        employee = UserFactory.generate();
        await UserFactory.createEmployee(employee);
    });

    beforeEach(async () => {
        editedUser = await UserFactory.createEmployee();
        dataToSend = UserFactory.generate();
    });

    afterEach(async () => {
        await editedUser.setRoles([]);
        await editedUser.destroy({ force: true });

        await request.post('/api/auth/logout');
    });

    afterAll(() => {
        redisSessionClient.quit();
        sequelize.close();
        server.close();
    });

    const update = (id, data) => {
        return request.put(`/api/users/${id}`).send(data);
    };

    describe('PUT /users/:id', () => {
        it('returns OK sending valid data including email as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { id } = editedUser;

            const { status, body } = await update(id, dataToSend);

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('id', id);
        });

        it('returns OK sending valid data excluding email as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            dataToSend.email = editedUser.email;
            const { id } = editedUser;

            const { status, body } = await update(id, dataToSend);

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('id', id);
        });

        it('returns BAD_REQUEST sending empty data as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, error } = await update(editedUser.id, {});

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'firstName',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'lastName',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'dateOfBirth',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'email',
                        message: 'This field is required.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            dataToSend.dateOfBirth = 'invalid';
            dataToSend.email = 'invalid';

            const { status, error } = await update(editedUser.id, dataToSend);

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'dateOfBirth',
                        message: 'Wrong date format. Should be YYYY-MM-DD.'
                    }),
                    expect.objectContaining({
                        param: 'email',
                        message: 'Wrong email format.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending taken email as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            dataToSend.email = employee.email;

            const { status, error } = await update(editedUser.id, dataToSend);

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'email',
                        message: 'Email is already in use.'
                    })
                ])
            );
        });

        it('returns FORBIDDEN sending valid data as EMPLOYEE', async () => {
            const { email, password } = employee;
            await login(request, email, password);

            const { status } = await update(editedUser.id, dataToSend);

            expect(status).toBe(HTTP.FORBIDDEN);
        });

        it('returns NOT_FOUND sending valid data but not existing id as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const fakeId = faker.datatype.uuid();

            const { status } = await update(fakeId, dataToSend);

            expect(status).toBe(HTTP.NOT_FOUND);
        });

        it('returns NOT_FOUND sending valid data but invalid id as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status } = await update('1234', dataToSend);

            expect(status).toBe(HTTP.NOT_FOUND);
        });

        it('returns UNAUTHORIZED sending valid data as NOT LOGGED IN', async () => {
            const { status } = await update(editedUser.id, dataToSend);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
