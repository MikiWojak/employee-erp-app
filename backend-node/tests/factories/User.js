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

    static async #createBase(props = {}, roleName) {
        const role = await roleRepository.findByName(roleName);

        return userRepository.create(
            this.generate({
                ...props,
                roleId: role.id
            })
        );
    }

    static async createAdmin(props = {}) {
        return this.#createBase(props, Role.ADMIN);
    }

    static async createManager(props = {}) {
        return this.#createBase(props, Role.MANAGER);
    }

    static async createEmployee(props = {}) {
        return this.#createBase(props, Role.EMPLOYEE);
    }
}

module.exports = UserFactory;
