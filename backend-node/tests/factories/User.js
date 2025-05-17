const faker = require('faker');
const dayjs = require('dayjs');

const { Role } = require('../../src/models');

const di = require('../../src/di');
const userRepository = di.get('repositories.user');
const roleRepository = di.get('repositories.role');

class UserFactory {
    static generate(props) {
        const dateOfBirth = dayjs(
            faker.date.between(
                dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
                dayjs().subtract(18, 'year').format('YYYY-MM-DD')
            )
        ).format('YYYY-MM-DD');

        const defaultProps = {
            roleId: faker.datatype.uuid(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            dateOfBirth,
            email: faker.internet.email().toLowerCase(),
            password: faker.internet.password()
        };

        return { ...defaultProps, ...props };
    }

    static async createAdmin(props = {}) {
        const roleAdmin = await roleRepository.findByName(Role.ADMIN);

        const user = await userRepository.create(this.generate(props));

        await user.setRole(roleAdmin);

        return user;
    }

    static async createEmployee(props = {}) {
        const roleEmployee = await roleRepository.findByName(Role.EMPLOYEE);

        const user = await userRepository.create(this.generate(props));

        await user.setRole(roleEmployee);

        return user;
    }
}

module.exports = UserFactory;
