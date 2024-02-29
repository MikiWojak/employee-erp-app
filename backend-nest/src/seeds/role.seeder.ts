import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Role, UserRole } from '../entities/Role';

export default class RoleSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const repository = dataSource.getRepository(Role);

        await repository.insert([
            { name: UserRole.ADMIN },
            { name: UserRole.EMPLOYEE }
        ]);
    }
}
