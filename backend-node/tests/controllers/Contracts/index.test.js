const server = require('../../../src/index');
const request = require('supertest-session')(server);
const { StatusCodes: HTTP } = require('http-status-codes');

const { Role } = require('../../../src/models');

const di = require('../../../src/di');
const { sequelize } = di.get('sequelize');
const roleRepository = di.get('repositories.role');
const redisSessionClient = di.get('redisSessionClient');

const UserFactory = require('../../factories/User');
const ContractFactory = require('../../factories/Contract');

const login = require('../../helpers/login');
const truncateDatabase = require('../../helpers/truncateDatabase');

let admin, employee1, employee2;

describe('Contracts', () => {
    beforeAll(async () => {
        await truncateDatabase();

        await roleRepository.create({ name: Role.ADMIN });
        await roleRepository.create({ name: Role.EMPLOYEE });

        admin = UserFactory.generate();
        await UserFactory.createAdmin(admin);

        employee1 = UserFactory.generate();
        const { id: id1 } = await UserFactory.createEmployee(employee1);
        employee1.id = id1;

        employee2 = UserFactory.generate();
        const { id: id2 } = await UserFactory.createEmployee(employee2);
        employee2.id = id2;

        await ContractFactory.create({ userId: employee1.id });
        await ContractFactory.create({ userId: employee2.id });
    });

    afterEach(async () => {
        await request.post('/api/auth/logout');
    });

    afterAll(() => {
        redisSessionClient.quit();
        sequelize.close();
        server.close();
    });

    describe('GET /contracts', () => {
        it('returns OK sending request as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await request.get('/api/contracts');

            expect(status).toBe(HTTP.OK);
            expect(body.rows.length).toBe(2);
        });

        it('returns OK sending request as EMPLOYEE', async () => {
            const { id, email, password } = employee1;
            await login(request, email, password);

            const { status, body } = await request.get('/api/contracts');

            expect(status).toBe(HTTP.OK);
            expect(body.rows.length).toBe(1);
            body.rows.forEach(item => {
                expect(item).toHaveProperty('userId', id);
            });
        });

        it('returns UNAUTHORIZED sending request as NOT LOGGED IN', async () => {
            const { status } = await request.get('/api/contracts');

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
