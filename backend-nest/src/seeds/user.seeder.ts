import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from '../entities/User';
import { Role, UserRole } from '../entities/Role';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const userFactory = await factoryManager.get(User);
        const roleRepository = dataSource.getRepository(Role);

        const [adminRole, employeeRole] = await Promise.all([
            roleRepository.findOneBy({ name: UserRole.ADMIN }),
            roleRepository.findOneBy({ name: UserRole.EMPLOYEE })
        ]);

        await userFactory.save({
            lastName: 'Admin',
            email: 'admin@erp.test',
            role: adminRole || undefined
        });

        await userFactory.save({
            lastName: 'Employee',
            email: 'employee@erp.test',
            role: employeeRole || undefined
        });

        await userFactory.saveMany(10, {
            role: employeeRole || undefined
        });
    }
}
