const faker = require('faker');
const { StatusCodes: HTTP } = require('http-status-codes');

const server = require('../../../src/index');
const request = require('supertest-session')(server);

const { Role } = require('../../../src/models');

const di = require('../../../src/di');
const { sequelize } = di.get('sequelize');
const roleRepository = di.get('repositories.role');
const redisSessionClient = di.get('redisSessionClient');
const departmentRepository = di.get('repositories.department');

const UserFactory = require('../../factories/User');

const login = require('../../helpers/login');
const truncateDatabase = require('../../helpers/truncateDatabase');

let admin, manager, employee;
let departmentOne, departmentTwo;

describe('Users', () => {
    let dataToSend;

    beforeAll(async () => {
        const sendEmailHandlerMock = di.get('services.sendEmail');
        jest.spyOn(sendEmailHandlerMock, 'handle').mockImplementation(() => {});

        await truncateDatabase();

        await roleRepository.bulkCreate([
            { name: Role.ADMIN },
            { name: Role.MANAGER },
            { name: Role.EMPLOYEE }
        ]);

        departmentOne = await departmentRepository.create({ name: 'R&D' });
        departmentTwo = await departmentRepository.create({ name: 'Finance' });

        admin = UserFactory.generate();
        manager = UserFactory.generate({ departmentId: departmentOne.id });
        employee = UserFactory.generate({ departmentId: departmentOne.id });

        await Promise.all([
            UserFactory.createAdmin(admin),
            UserFactory.createManager(manager),
            UserFactory.createEmployee(employee)
        ]);
    });

    beforeEach(() => {
        dataToSend = UserFactory.generate({ role: Role.EMPLOYEE });
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
        it('returns CREATED sending valid data (admin) as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await store({
                ...dataToSend,
                role: Role.ADMIN
            });

            expect(status).toBe(HTTP.CREATED);
            expect(body).toHaveProperty('email', dataToSend.email);
        });

        it('returns CREATED sending valid data (employee) as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await store({
                ...dataToSend,
                departmentId: departmentOne.id
            });

            expect(status).toBe(HTTP.CREATED);
            expect(body).toHaveProperty('email', dataToSend.email);
        });

        it('returns CREATED sending valid data (employee) as MANAGER', async () => {
            const { email, password } = manager;
            await login(request, email, password);

            delete dataToSend.role;

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
                        param: 'role',
                        message: 'This field is required.'
                    }),
                    expect.not.objectContaining({
                        param: 'departmentId'
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

            const invalidForm = {
                firstName: 'a',
                lastName: 'a',
                role: 'invalid',
                dateOfBirth: 'invalid',
                email: 'invalid'
            };

            const { status, error } = await store(invalidForm);

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'firstName',
                        message:
                            'This field must have between 2 and 255 characters.'
                    }),
                    expect.objectContaining({
                        param: 'lastName',
                        message:
                            'This field must have between 2 and 255 characters.'
                    }),
                    expect.objectContaining({
                        param: 'role',
                        message: 'This role does not exist.'
                    }),
                    expect.not.objectContaining({
                        param: 'departmentId'
                    }),
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

        it('returns BAD_REQUEST sending invalid firstName, lastName, empty department and taken email as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, error } = await store({
                ...dataToSend,
                firstName: 'a'.repeat(256),
                lastName: 'a'.repeat(256),
                email: employee.email
            });

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'firstName',
                        message:
                            'This field must have between 2 and 255 characters.'
                    }),
                    expect.objectContaining({
                        param: 'lastName',
                        message:
                            'This field must have between 2 and 255 characters.'
                    }),
                    expect.objectContaining({
                        param: 'departmentId',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'email',
                        message: 'Email is already in use.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending invalid department as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, error } = await store({
                ...dataToSend,
                departmentId: 'a'
            });

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'departmentId',
                        message: 'Wrong UUID format.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending not existing departmentId as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, error } = await store({
                ...dataToSend,
                departmentId: faker.datatype.uuid()
            });

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'departmentId',
                        message: 'Department not found.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending empty data as MANAGER', async () => {
            const { email, password } = manager;
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
                    expect.not.objectContaining({
                        param: 'role'
                    }),
                    expect.not.objectContaining({
                        param: 'departmentId'
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
