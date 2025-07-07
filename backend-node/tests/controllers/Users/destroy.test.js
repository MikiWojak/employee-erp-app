const faker = require('faker');
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

let admin, manager, employee;
let managerData;
let departmentOne, departmentTwo;

describe('Users', () => {
    let deletedUser;

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
            UserFactory.createEmployee(employee)
        ]);
        managerData = await UserFactory.createManager(manager);
    });

    beforeEach(async () => {
        deletedUser = await UserFactory.createEmployee({
            departmentId: departmentOne.id
        });
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

    const indexCheck = () => {
        return request.get('/api/users').query({ page: 1, perPage: 100 });
    };

    describe('DELETE /users/:id', () => {
        it('returns NO_CONTENT sending valid ID as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status } = await destroy(deletedUser.id);

            expect(status).toBe(HTTP.NO_CONTENT);

            const { status: statusCheck, body } = await indexCheck();

            expect(statusCheck).toBe(HTTP.OK);
            expect(body.rows).toEqual(
                expect.arrayContaining([
                    expect.not.objectContaining({
                        id: deletedUser.id,
                        email: deletedUser.email
                    })
                ])
            );
        });

        it('returns NO_CONTENT sending not existing ID as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const fakeId = faker.datatype.uuid();

            const { status } = await destroy(fakeId);

            expect(status).toBe(HTTP.NO_CONTENT);
        });

        it('returns NO_CONTENT sending invalid ID as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status } = await destroy('1234');

            expect(status).toBe(HTTP.NO_CONTENT);
        });

        it('returns NO_CONTENT sending valid ID from the same department as MANAGER', async () => {
            const { email, password } = manager;
            await login(request, email, password);

            const { status } = await destroy(deletedUser.id);

            expect(status).toBe(HTTP.NO_CONTENT);

            const { status: statusCheck, body } = await indexCheck();

            expect(statusCheck).toBe(HTTP.OK);
            expect(body.rows).toEqual(
                expect.arrayContaining([
                    expect.not.objectContaining({
                        id: deletedUser.id,
                        email: deletedUser.email
                    })
                ])
            );
        });

        it('returns FORBIDDEN sending valid ID as EMPLOYEE', async () => {
            const { email, password } = employee;
            await login(request, email, password);

            const { status } = await destroy(deletedUser.id);

            expect(status).toBe(HTTP.FORBIDDEN);
        });

        it('returns UNPROCESSABLE_ENTITY sending valid ID from different department as MANAGER', async () => {
            const deletedUserOther = await UserFactory.createEmployee({
                departmentId: departmentTwo.id
            });

            const { email, password } = manager;
            await login(request, email, password);

            const { status, error } = await destroy(deletedUserOther.id);

            expect(status).toBe(HTTP.UNPROCESSABLE_ENTITY);
            expect(error.text).toEqual(
                'Manager can delete user from the same department only.'
            );
        });

        it('returns UNPROCESSABLE_ENTITY sending valid ID of manager from the same department as MANAGER', async () => {
            const deletedUserOther = await UserFactory.createManager({
                departmentId: departmentOne.id
            });

            const { email, password } = manager;
            await login(request, email, password);

            const { status, error } = await destroy(deletedUserOther.id);

            expect(status).toBe(HTTP.UNPROCESSABLE_ENTITY);
            expect(error.text).toEqual('Manager can delete employee only.');
        });

        it("returns UNPROCESSABLE_ENTITY sending logged user's ID as MANAGER", async () => {
            const { email, password } = manager;
            await login(request, email, password);

            const { status, error } = await destroy(managerData.id);

            expect(status).toBe(HTTP.UNPROCESSABLE_ENTITY);
            expect(error.text).toEqual('You cannot delete your own account.');
        });

        it('returns UNAUTHORIZED sending valid ID as NOT LOGGED IN', async () => {
            const { status } = await destroy(deletedUser.id);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });

        it('returns INTERNAL_SERVER_ERROR when TRANSACTION FAILS as MANAGER', async () => {
            const userRepositoryMock = di.get('repositories.user');
            jest.spyOn(
                userRepositoryMock.model.prototype,
                'destroy'
            ).mockImplementationOnce(() => {
                throw new Error('Test error');
            });

            const { email, password } = manager;
            await login(request, email, password);

            const { status, error } = await destroy(deletedUser.id);

            expect(status).toBe(HTTP.INTERNAL_SERVER_ERROR);
            expect(error.text).toEqual('We messed something up. Sorry!');

            const { status: statusCheck, body } = await indexCheck();

            expect(statusCheck).toBe(HTTP.OK);
            expect(body.rows).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: deletedUser.id,
                        email: deletedUser.email
                    })
                ])
            );
        });
    });
});
