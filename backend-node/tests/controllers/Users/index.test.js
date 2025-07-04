const server = require('../../../src/index');
const request = require('supertest-session')(server);
const { StatusCodes: HTTP } = require('http-status-codes');

const { Role } = require('../../../src/models');

const di = require('../../../src/di');
const { sequelize } = di.get('sequelize');
const roleRepository = di.get('repositories.role');
const redisSessionClient = di.get('redisSessionClient');
const departmentRepository = di.get('repositories.department');

const UserFactory = require('../../factories/User');

const login = require('../../helpers/login');
const truncateDatabase = require('../../helpers/truncateDatabase');

let admin, managerOne, managerTwo, employee, employeeOther;

describe('Users', () => {
    beforeAll(async () => {
        await truncateDatabase();

        await roleRepository.bulkCreate([
            { name: Role.ADMIN },
            { name: Role.MANAGER },
            { name: Role.EMPLOYEE }
        ]);

        const [departmentOne, departmentTwo] = await Promise.all([
            departmentRepository.create({ name: 'R&D' }),
            departmentRepository.create({ name: 'Finance' })
        ]);

        admin = UserFactory.generate();
        managerOne = UserFactory.generate();
        managerTwo = UserFactory.generate();
        employee = UserFactory.generate();
        employeeOther = UserFactory.generate();

        await Promise.all([
            UserFactory.createAdmin(admin),
            UserFactory.createManager({
                ...managerOne,
                departmentId: departmentOne.id
            }),
            UserFactory.createManager({
                ...managerTwo,
                departmentId: departmentOne.id
            }),
            UserFactory.createEmployee({
                ...employee,
                departmentId: departmentOne.id
            }),
            UserFactory.createEmployee({
                ...employeeOther,
                departmentId: departmentTwo.id
            })
        ]);
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
        it('returns OK sending request with no query params as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await request.get('/api/users');

            expect(status).toBe(HTTP.OK);
            expect(body.count).toBe(4);
            expect(body.rows).toEqual(
                expect.arrayContaining([
                    expect.not.objectContaining({
                        email: admin.email,
                        dateOfBirth: admin.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: managerOne.email,
                        dateOfBirth: managerOne.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: managerTwo.email,
                        dateOfBirth: managerTwo.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: employee.email,
                        dateOfBirth: employee.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: employeeOther.email,
                        dateOfBirth: employeeOther.dateOfBirth
                    })
                ])
            );
        });

        it("returns OK sending request with query param 'allRoles' as ADMIN", async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await request
                .get('/api/users')
                .query({ allRoles: true });

            expect(status).toBe(HTTP.OK);
            expect(body.count).toBe(5);
            expect(body.rows).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        email: admin.email,
                        dateOfBirth: admin.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: managerOne.email,
                        dateOfBirth: managerOne.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: managerTwo.email,
                        dateOfBirth: managerTwo.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: employee.email,
                        dateOfBirth: employee.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: employeeOther.email,
                        dateOfBirth: employeeOther.dateOfBirth
                    })
                ])
            );
        });

        it('returns OK sending request with no query params as MANAGER', async () => {
            const { email, password } = managerOne;
            await login(request, email, password);

            const { status, body } = await request.get('/api/users');

            expect(status).toBe(HTTP.OK);
            expect(body.count).toBe(1);
            expect(body.rows).toEqual(
                expect.arrayContaining([
                    expect.not.objectContaining({
                        email: admin.email,
                        dateOfBirth: admin.dateOfBirth
                    }),
                    expect.not.objectContaining({
                        email: managerOne.email,
                        dateOfBirth: managerOne.dateOfBirth
                    }),
                    expect.not.objectContaining({
                        email: managerTwo.email,
                        dateOfBirth: managerTwo.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: employee.email,
                        dateOfBirth: employee.dateOfBirth
                    }),
                    expect.not.objectContaining({
                        email: employeeOther.email,
                        dateOfBirth: employeeOther.dateOfBirth
                    })
                ])
            );
        });

        it("returns OK sending request with query param 'allRoles' as MANAGER", async () => {
            const { email, password } = managerOne;
            await login(request, email, password);

            const { status, body } = await request
                .get('/api/users')
                .query({ allRoles: true });

            expect(status).toBe(HTTP.OK);
            expect(body.count).toBe(3);
            expect(body.rows).toEqual(
                expect.arrayContaining([
                    expect.not.objectContaining({
                        email: admin.email,
                        dateOfBirth: admin.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: managerOne.email,
                        dateOfBirth: managerOne.dateOfBirth
                    }),
                    expect.not.objectContaining({
                        email: managerTwo.email,
                        dateOfBirth: managerTwo.dateOfBirth
                    }),
                    expect.objectContaining({
                        email: managerTwo.email,
                        dateOfBirth: null
                    }),
                    expect.objectContaining({
                        email: employee.email,
                        dateOfBirth: employee.dateOfBirth
                    }),
                    expect.not.objectContaining({
                        email: employeeOther.email,
                        dateOfBirth: employeeOther.dateOfBirth
                    })
                ])
            );
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
