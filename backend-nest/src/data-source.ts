import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';

import config from './config';
import InitSeeder from './seeds/init.seeder';

const options: DataSourceOptions & SeederOptions = {
    ...config().db,
    seeds: [InitSeeder],
    entities: ['src/entities/*{.ts,.js}'],
    factories: ['src/factories/*{.ts,.js}']
};

export const dataSource = new DataSource(options);
