import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { RedisClientFactory } from '@/services/RedisClientFactory';

import RedisStore from 'connect-redis';

@Injectable()
export class RedisStoreFactory {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisClient: RedisClientFactory
    ) {}

    create() {
        const redisSessionConfig = this.configService.get('redisSession');

        const redisStore = new RedisStore({
            client: this.redisClient,
            ttl: redisSessionConfig.ttl
        });

        const id = Math.random().toString(36).substring(2);
        const logger = new Logger();
        logger.log(`Redis store instance created #ID ${id}`);

        return redisStore;
    }
}
