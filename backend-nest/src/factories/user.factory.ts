import * as dayjs from 'dayjs';
import { setSeederFactory } from 'typeorm-extension';

import { User } from '../entities/User';

export default setSeederFactory(User, faker => {
    const user = new User();

    user.firstName = faker.person.firstName('male');
    user.lastName = faker.person.lastName('male');
    user.dateOfBirth = dayjs(
        faker.date.between({
            from: dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
            to: dayjs().subtract(18, 'year').format('YYYY-MM-DD')
        })
    ).format('YYYY-MM-DD');
    user.email = faker.internet
        .email({
            firstName: user.firstName,
            lastName: user.lastName
        })
        .toLowerCase();
    user.password = 'Test123#';

    return user;
});
