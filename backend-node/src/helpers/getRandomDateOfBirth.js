const dayjs = require('dayjs');
const faker = require('faker');

module.exports = () =>
    dayjs(
        faker.date.between(
            dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
            dayjs().subtract(20, 'year').format('YYYY-MM-DD')
        )
    ).format('YYYY-MM-DD');
