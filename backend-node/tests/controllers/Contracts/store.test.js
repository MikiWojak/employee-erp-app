const faker = require('faker');
const dayjs = require('dayjs');
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

let admin, employee;

describe('Contracts', () => {
    let dataToSend;

    beforeEach(async () => {
        await truncateDatabase();

        await roleRepository.create({ name: Role.ADMIN });
        await roleRepository.create({ name: Role.EMPLOYEE });

        admin = UserFactory.generate();
        await UserFactory.createAdmin(admin);

        employee = UserFactory.generate();
        const { id } = await UserFactory.createEmployee(employee);
        employee.id = id;

        dataToSend = ContractFactory.generate({ userId: employee.id });
    });

    afterEach(async () => {
        await request.post('/api/auth/logout');
    });

    afterAll(() => {
        redisSessionClient.quit();
        sequelize.close();
        server.close();
    });

    const store = data => {
        return request.post('/api/contracts').send(data);
    };

    describe('POST /contracts', () => {
        it('returns CREATED sending valid data as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            const { status } = await store(dataToSend);

            expect(status).toBe(HTTP.CREATED);
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
                        param: 'userId',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'position',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'startDate',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'endDate',
                        message: 'This field is required.'
                    }),
                    expect.objectContaining({
                        param: 'vacationDaysPerYear',
                        message: 'This field is required.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            dataToSend.userId = 'invalid';
            dataToSend.startDate = 'invalid';
            dataToSend.endDate = 'invalid';
            dataToSend.vacationDaysPerYear = 'invalid';

            const { status, error } = await store(dataToSend);

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'userId',
                        message: 'Wrong UUID format.'
                    }),
                    expect.objectContaining({
                        param: 'startDate',
                        message: 'Wrong date format. Should be YYYY-MM-DD.'
                    }),
                    expect.objectContaining({
                        param: 'endDate',
                        message: 'Wrong date format. Should be YYYY-MM-DD.'
                    }),
                    expect.objectContaining({
                        param: 'vacationDaysPerYear',
                        message: 'This field must be an integer.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending not existing employee and end date before start date as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            dataToSend.userId = faker.datatype.uuid();
            dataToSend.startDate = dayjs().add(3, 'month').format('YYYY-MM-DD');
            dataToSend.endDate = dayjs().format('YYYY-MM-DD');

            const { status, error } = await store(dataToSend);

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'userId',
                        message: 'Employee not found.'
                    }),
                    expect.objectContaining({
                        param: 'endDate',
                        message: 'End date can not be before start date.'
                    })
                ])
            );
        });

        it('returns BAD_REQUEST sending contract overlapping another one as ADMIN', async () => {
            const { email, password } = admin;
            await login(request, email, password);

            await ContractFactory.create({
                userId: employee.id,
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: dayjs().add(6, 'month').format('YYYY-MM-DD')
            });

            dataToSend.startDate = dayjs().add(3, 'month').format('YYYY-MM-DD');
            dataToSend.endDate = dayjs().add(9, 'month').format('YYYY-MM-DD');

            const { status, error } = await store(dataToSend);

            const { errors } = JSON.parse(error.text);

            expect(status).toBe(HTTP.BAD_REQUEST);
            expect(errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        param: 'endDate',
                        message: 'Contract overlaps other one.'
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
