import { DataSource } from 'typeorm';
import { Seeder, runSeeders } from 'typeorm-extension';

import RoleSeeder from './role.seeder';
import UserSeeder from './user.seeder';

import userFactory from '../factories/user.factory';

export default class InitSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        await runSeeders(dataSource, {
            seeds: [RoleSeeder, UserSeeder],
            factories: [userFactory]
        });
    }
}
