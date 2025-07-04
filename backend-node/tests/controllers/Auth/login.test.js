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

let admin, employee, employeeNoPassword;

describe('Auth', () => {
    beforeAll(async () => {
        await truncateDatabase();

        await roleRepository.create({ name: Role.ADMIN });
        await roleRepository.create({ name: Role.EMPLOYEE });

        admin = UserFactory.generate();
        await UserFactory.createAdmin(admin);

        employee = UserFactory.generate();
        await UserFactory.createEmployee(employee);

        employeeNoPassword = UserFactory.generate();
        await UserFactory.createEmployee({
            ...employeeNoPassword,
            password: null
        });
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
            const { email, password } = employee;

            const { status, body } = await login(request, email, password);

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('email', email);
            expect(body).not.toHaveProperty('password');
        });

        it('returns OK sending valid data as ADMIN', async () => {
            const { email: adminEmail, password: adminPassword } = admin;

            await login(request, adminEmail, adminPassword);

            const { email, password } = employee;

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
                        message:
                            'This field must have between 8 and 64 characters.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending too long password as NOT LOGGED IN', async () => {
            const { email } = employee;

            const { status, error } = await login(
                request,
                email,
                'p'.repeat(65)
            );

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'password',
                        message:
                            'This field must have between 8 and 64 characters.'
                    })
                ])
            );
        });

        it('returns UNAUTHORIZED sending mismatching email as NOT LOGGED IN', async () => {
            const { email, password } = employee;
            const { status } = await login(request, `a${email}`, password);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });

        it('returns UNAUTHORIZED sending mismatching password as NOT LOGGED IN', async () => {
            const { email, password } = employee;
            const { status } = await login(request, email, `a${password}`);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });

        it('returns UNAUTHORIZED trying to log in to account with no password as NOT LOGGED IN', async () => {
            const { email, password } = employeeNoPassword;
            const { status } = await login(request, email, password);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
