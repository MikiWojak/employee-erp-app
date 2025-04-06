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
    let dataToSend;

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

    beforeEach(() => {
        dataToSend = UserFactory.generate();
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

    const store = data => {
        return request.post('/api/users').send(data);
    };

    describe('POST /users', () => {
        it('returns CREATED sending valid data as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await store(dataToSend);

            expect(status).toBe(HTTP.CREATED);
            expect(body).toHaveProperty('email', dataToSend.email);
        });

        it('returns BAD_REQUEST sending empty data as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, error } = await store({});

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
                    }),
                    expect.objectContaining({
                        param: 'password',
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
            dataToSend.password = 'p';

            const { status, error } = await store(dataToSend);

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
                    }),
                    expect.objectContaining({
                        param: 'password',
                        message: 'This field must have at least 8 letters.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending taken email as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            dataToSend.email = employee.email;

            const { status, error } = await store(dataToSend);

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

            const { status } = await store(dataToSend);

            expect(status).toBe(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending valid data as NOT LOGGED IN', async () => {
            const { status } = await store(dataToSend);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
