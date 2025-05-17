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
        const role = await roleRepository.findByName(Role.ADMIN);

        return userRepository.create(
            this.generate({
                ...props,
                roleId: role.id
            })
        );

        return user;
    }

    static async createEmployee(props = {}) {
        const role = await roleRepository.findByName(Role.EMPLOYEE);

        return userRepository.create(
            this.generate({
                ...props,
                roleId: role.id
            })
        );
    }
}

module.exports = UserFactory;
