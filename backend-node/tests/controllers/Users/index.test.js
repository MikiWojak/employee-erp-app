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
    beforeAll(async () => {
        await truncateDatabase();

        await roleRepository.create({ name: Role.ADMIN });
        await roleRepository.create({ name: Role.EMPLOYEE });

        admin = UserFactory.generate();
        await UserFactory.createAdmin(admin);

        employee = UserFactory.generate();
        await UserFactory.createEmployee(employee);

        await UserFactory.createEmployee();
    });

    afterEach(async () => {
        await request.post('/api/auth/logout');
    });

    afterAll(async () => {
        const queueConnection = await di.get('queues.connection');
        await queueConnection.close();

        redisSessionClient.quit();
        sequelize.close();
        server.close();
    });

    describe('GET /users', () => {
        it('returns OK sending request as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await request.get('/api/users');

            expect(status).toBe(HTTP.OK);
            expect(body.rows.length).toBe(2);
        });

        it('returns FORBIDDEN sending request as EMPLOYEE', async () => {
            const { email, password } = employee;
            await login(request, email, password);

            const { status } = await request.get('/api/users');

            expect(status).toBe(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request as NOT LOGGED IN', async () => {
            const { status } = await request.get('/api/users');

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
