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
    let deletedUser;

    beforeAll(async () => {
        const sendEmailHandlerMock = di.get('services.sendEmail');
        jest.spyOn(sendEmailHandlerMock, 'handle').mockImplementation(() => {});

        await truncateDatabase();

        await roleRepository.create({ name: Role.ADMIN });
        await roleRepository.create({ name: Role.EMPLOYEE });

        admin = UserFactory.generate();
        await UserFactory.createAdmin(admin);

        employee = UserFactory.generate();
        await UserFactory.createEmployee(employee);
    });

    beforeEach(async () => {
        deletedUser = await UserFactory.createEmployee();
    });

    afterEach(async () => {
        await deletedUser.destroy({ force: true });

        await request.post('/api/auth/logout');
    });

    afterAll(async () => {
        const queueConnection = await di.get('queues.connection');
        await queueConnection.close();

        redisSessionClient.quit();
        sequelize.close();
        server.close();
    });

    const destroy = id => {
        return request.delete(`/api/users/${id}`);
    };

    describe('DELETE /users/:id', () => {
        it('returns NO_CONTENT sending valid id as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status } = await destroy(deletedUser.id);

            expect(status).toBe(HTTP.NO_CONTENT);
        });

        it('returns NO_CONTENT sending not existing id as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const fakeId = faker.datatype.uuid();

            const { status } = await destroy(fakeId);

            expect(status).toBe(HTTP.NO_CONTENT);
        });

        it('returns NO_CONTENT sending invalid id as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status } = await destroy('1234');

            expect(status).toBe(HTTP.NO_CONTENT);
        });

        it('returns FORBIDDEN sending valid ID as EMPLOYEE', async () => {
            const { email, password } = employee;
            await login(request, email, password);

            const { status } = await destroy(deletedUser.id);

            expect(status).toBe(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending valid ID as NOT LOGGED IN', async () => {
            const { status } = await destroy(deletedUser.id);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
