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

let employee;

describe('Auth', () => {
    beforeAll(async () => {
        await truncateDatabase();

        await roleRepository.create({ name: Role.EMPLOYEE });

        employee = UserFactory.generate();
        await UserFactory.createEmployee(employee);
    });

    afterAll(async () => {
        const queueConnection = await di.get('queues.connection');
        await queueConnection.close();

        redisSessionClient.quit();
        sequelize.close();
        server.close();
    });

    afterEach(async () => {
        await request.post('/api/auth/logout');
    });

    describe('POST /auth/logout', () => {
        it('returns NO_CONTENT sending request as ADMIN', async () => {
            const { email, password } = employee;
            await login(request, email, password);

            const { status } = await request.post('/api/auth/logout');

            expect(status).toBe(HTTP.NO_CONTENT);
        });

        it('returns NO_CONTENT sending request as NOT LOGGED IN', async () => {
            const { status } = await request.post('/api/auth/logout');

            expect(status).toBe(HTTP.NO_CONTENT);
        });
    });
});
