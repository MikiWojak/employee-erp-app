const faker = require('faker');
const dayjs = require('dayjs');

const di = require('../../src/di');
const contractRepository = di.get('repositories.contract');

class ContractFactory {
    static generate(props) {
        const startDate = dayjs(
            faker.date.between(
                dayjs().subtract(2, 'year').format('YYYY-MM-DD'),
                dayjs().add(2, 'year').format('YYYY-MM-DD')
            )
        ).format('YYYY-MM-DD');

        const endDate = dayjs(
            faker.date.between(
                startDate,
                dayjs(startDate).add(5, 'year').format('YYYY-MM-DD')
            )
        ).format('YYYY-MM-DD');

        const defaultProps = {
            userId: faker.datatype.uuid(),
            position: faker.lorem.word(),
            startDate,
            endDate,
            vacationDaysPerYear: faker.random.arrayElement([20, 26])
        };

        return { ...defaultProps, ...props };
    }

    static create(props) {
        return contractRepository.create(this.generate(props));
    }
}

module.exports = ContractFactory;
