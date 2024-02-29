import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisClientFactory {
    constructor(private readonly configService: ConfigService) {}

    async create() {
        const redisSessionConfig = this.configService.get('redisSession');
        const { password, host, port } = redisSessionConfig;

        const client = createClient({
            url: `redis://:${password}@${host}:${port}`
        });

        const id = Math.random().toString(36).substring(2);
        const logger = new Logger();
        logger.log(`Redis client instance created #ID ${id}`);

        await client.connect();

        return client;
    }
}
