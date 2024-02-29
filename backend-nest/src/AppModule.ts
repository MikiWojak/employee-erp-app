import {
    Module,
    NestModule,
    RequestMethod,
    MiddlewareConsumer
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import appConfig from '@/config';
import { AuthModule } from '@/modules/AuthModule';
import { RoleModule } from '@/modules/RoleModule';
import { UserModule } from '@/modules/UserModule';
import { configValidationSchema } from '@/config/schema';
import { AuthMiddleware } from '@/middleware/AuthMiddleware';
import { RedisStoreFactory } from '@/services/RedisStoreFactory';
import { RedisClientFactory } from '@/services/RedisClientFactory';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const dbConfig = configService.get('db');
                const appConfig = configService.get('app');

                return {
                    ...dbConfig,
                    entities: [__dirname + '/entities/*.{ts,js}'],
                    synchronize: appConfig.env !== 'production' // @NOTE Be careful with this option!
                };
            }
        }),
        ConfigModule.forRoot({
            load: [appConfig],
            validationSchema: configValidationSchema,
            isGlobal: true
        }),
        AuthModule,
        RoleModule,
        UserModule
    ],
    providers: [
        {
            useFactory: (config: ConfigService) => {
                const redisClient = new RedisClientFactory(config);

                return redisClient.create();
            },
            provide: RedisClientFactory,
            inject: [ConfigService]
        },
        {
            useFactory: (
                config: ConfigService,
                redisClient: RedisClientFactory
            ) => {
                const redisStore = new RedisStoreFactory(config, redisClient);

                return redisStore.create();
            },
            provide: RedisStoreFactory,
            inject: [ConfigService, RedisClientFactory]
        }
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                { path: '/auth/login', method: RequestMethod.POST },
                { path: '/auth/logout', method: RequestMethod.POST }
            )
            .forRoutes({ path: '/*', method: RequestMethod.ALL });
    }
}
