import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

import { RedisStoreFactory } from '@/services/RedisStoreFactory';

export const useSession = async app => {
    const config = app.get(ConfigService);
    const sessionConfig = config.get('session');

    const redisStore = app.get(RedisStoreFactory);

    app.use(
        session({
            secret: sessionConfig.secret,
            resave: true,
            saveUninitialized: false,
            store: redisStore
        })
    );
};
