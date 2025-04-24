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

    describe('POST /auth/login', () => {
        it('returns OK sending valid data as NOT LOGGED IN', async () => {
            const { email, password } = admin;

            const { status, body } = await login(request, email, password);

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns OK sending valid data as EMPLOYEE', async () => {
            const { email: employeeEmail, password: employeePassword } =
                employee;

            await login(request, employeeEmail, employeePassword);

            const { email, password } = admin;

            const { status, body } = await login(request, email, password);

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns BAD_REQUEST sending empty data as NOT LOGGED IN', async () => {
            const { status, error } = await login(request, '', '');

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'email',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'password',
                        message: 'This field is required.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending invalid data as NOT LOGGED IN', async () => {
            const { status, error } = await login(request, 'invalid', 'p');

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'email',
                        message: 'Wrong email format.'
                    }),
                    expect.objectContaining({
                        param: 'password',
                        message: 'This field must have at least 8 letters.'
                    })
                ])
            );
        });

        it('returns UNAUTHORIZED sending mismatching email as NOT LOGGED IN', async () => {
            const { email, password } = admin;
            const { status } = await login(request, `a${email}`, password);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });

        it('returns UNAUTHORIZED sending mismatching password as NOT LOGGED IN', async () => {
            const { email, password } = admin;
            const { status } = await login(request, email, `a${password}`);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
