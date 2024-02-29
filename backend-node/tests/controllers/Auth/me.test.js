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

describe('Auth', () => {
    beforeAll(async () => {
        await truncateDatabase();

        await roleRepository.create({ name: Role.ADMIN });
        await roleRepository.create({ name: Role.EMPLOYEE });

        admin = UserFactory.generate();
        await UserFactory.createAdmin(admin);

        employee = UserFactory.generate();
        await UserFactory.createEmployee(employee);
    });

    afterAll(() => {
        redisSessionClient.quit();
        sequelize.close();
        server.close();
    });

    afterEach(async () => {
        await request.post('/api/auth/logout');
    });

    describe('GET /auth/me', () => {
        it('returns OK sending request as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await request.get('/api/auth/me');

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns OK sending request as EMPLOYEE', async () => {
            const { email, password } = employee;
            await login(request, email, password);

            const { status, body } = await request.get('/api/auth/me');

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns UNAUTHORIZED sending request as NOT LOGGED IN', async () => {
            const { status } = await request.get('/api/auth/me');

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
