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
    let editedUser;
    let dataToSend;

    beforeAll(async () => {
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
        editedUser = await UserFactory.createEmployee({
            departmentId: departmentOne.id
        });
        dataToSend = UserFactory.generate({
            role: Role.EMPLOYEE,
            departmentId: editedUser.departmentId
        });
    });

    afterEach(async () => {
        await editedUser.destroy({ force: true });

        await request.post('/api/auth/logout');
    });

    afterAll(async () => {
        const queueConnection = await di.get('queues.connection');
        await queueConnection.close();

        redisSessionClient.quit();
        sequelize.close();
        server.close();
    });

    const update = (id, data) => {
        return request.put(`/api/users/${id}`).send(data);
    };

    describe('PUT /users/:id', () => {
        it('returns OK sending valid data excluding email as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { id } = editedUser;

            const { status, body } = await update(id, {
                ...dataToSend,
                email: editedUser.email
            });

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('id', id);
            expect(body).toHaveProperty('firstName', dataToSend.firstName);
            expect(body).toHaveProperty('lastName', dataToSend.lastName);
            expect(body).toHaveProperty('dateOfBirth', dataToSend.dateOfBirth);
            expect(body).toHaveProperty('email', editedUser.email);
        });

        it('returns OK sending valid data including email, role and department as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { id } = editedUser;

            const { status, body } = await update(id, {
                ...dataToSend,
                role: Role.MANAGER,
                departmentId: departmentTwo.id
            });

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('id', id);
            expect(body).toHaveProperty('firstName', dataToSend.firstName);
            expect(body).toHaveProperty('lastName', dataToSend.lastName);
            expect(body).toHaveProperty('dateOfBirth', dataToSend.dateOfBirth);
            expect(body).toHaveProperty('email', dataToSend.email);
            expect(body).toHaveProperty('role.name', Role.MANAGER);
            expect(body).toHaveProperty('departmentId', departmentTwo.id);
        });

        it('returns OK sending valid data for other admin as ADMIN', async () => {
            const adminOther = await UserFactory.createAdmin();

            const { email, password } = admin;
            await login(request, email, password);

            const { status, body } = await update(adminOther.id, {
                ...dataToSend,
                role: Role.ADMIN
            });

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('id', adminOther.id);
            expect(body).toHaveProperty('firstName', dataToSend.firstName);
            expect(body).toHaveProperty('lastName', dataToSend.lastName);
            expect(body).toHaveProperty('dateOfBirth', dataToSend.dateOfBirth);
            expect(body).toHaveProperty('email', dataToSend.email);
            expect(body).toHaveProperty('role.name', Role.ADMIN);
            expect(body).toHaveProperty('departmentId', null);
        });

        it('returns OK sending valid data including other role and department as MANAGER', async () => {
            const { email, password } = manager;
            await login(request, email, password);

            const { id } = editedUser;

            const { status, body } = await update(id, {
                ...dataToSend,
                role: Role.MANAGER,
                departmentId: departmentTwo.id
            });

            expect(status).toBe(HTTP.OK);
            expect(body).toHaveProperty('id', id);
            expect(body).toHaveProperty('firstName', dataToSend.firstName);
            expect(body).toHaveProperty('lastName', dataToSend.lastName);
            expect(body).toHaveProperty('dateOfBirth', dataToSend.dateOfBirth);
            expect(body).toHaveProperty('email', dataToSend.email);
            expect(body).toHaveProperty('role.name', Role.EMPLOYEE);
            expect(body).toHaveProperty('departmentId', departmentOne.id);
        });

        it('returns BAD_REQUEST sending empty data as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, error } = await update(editedUser.id, {});

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

            const { status, error } = await update(editedUser.id, invalidForm);

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

        it('returns BAD_REQUEST sending invalid firstName, lastName, no department and taken email as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            delete dataToSend.departmentId;

            const { status, error } = await update(editedUser.id, {
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

            const { status, error } = await update(editedUser.id, {
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

        it('returns BAD_REQUEST sending not existing department as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status, error } = await update(editedUser.id, {
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

            const { status, error } = await update(editedUser.id, {});

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

            const { status } = await update(editedUser.id, dataToSend);

            expect(status).toBe(HTTP.FORBIDDEN);
        });

        it('returns NOT_FOUND sending valid data but not existing ID as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const fakeId = faker.datatype.uuid();

            const { status } = await update(fakeId, dataToSend);

            expect(status).toBe(HTTP.NOT_FOUND);
        });

        it('returns NOT_FOUND sending valid data but invalid ID as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status } = await update('1234', dataToSend);

            expect(status).toBe(HTTP.NOT_FOUND);
        });

        it('returns UNPROCESSABLE_ENTITY sending valid data for logged user as MANAGER', async () => {
            const { email, password } = manager;
            await login(request, email, password);

            const { status, error } = await update(managerData.id, {
                ...dataToSend,
                role: Role.MANAGER
            });

            expect(status).toBe(HTTP.UNPROCESSABLE_ENTITY);
            expect(error.text).toEqual(
                'You cannot edit yourself here. Go to profile page.'
            );
        });

        it('returns UNPROCESSABLE_ENTITY sending valid data for employee from other department as MANAGER', async () => {
            const employeeOtherDepartment = await UserFactory.createEmployee({
                departmentId: departmentTwo.id
            });

            const { email, password } = manager;
            await login(request, email, password);

            const { status, error } = await update(
                employeeOtherDepartment.id,
                dataToSend
            );

            expect(status).toBe(HTTP.UNPROCESSABLE_ENTITY);
            expect(error.text).toEqual(
                'Manager can edit user from the same department only.'
            );
        });

        it('returns UNPROCESSABLE_ENTITY sending valid data for manager from the same department as MANAGER', async () => {
            const managerOther = await UserFactory.createManager({
                departmentId: departmentOne.id
            });

            const { email, password } = manager;
            await login(request, email, password);

            const { status, error } = await update(managerOther.id, dataToSend);

            expect(status).toBe(HTTP.UNPROCESSABLE_ENTITY);
            expect(error.text).toEqual('Manager can edit employee only.');
        });

        it('returns UNAUTHORIZED sending valid data as NOT LOGGED IN', async () => {
            const { status } = await update(editedUser.id, dataToSend);

            expect(status).toBe(HTTP.UNAUTHORIZED);
        });
    });
});
