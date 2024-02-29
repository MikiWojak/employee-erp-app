import { ConfigService } from '@nestjs/config';

export const useCors = app => {
    const config = app.get(ConfigService);
    const appConfig = config.get('app');

    const originsWhitelist = [appConfig.frontendUrl];

    const corsOptions = {
        origin(origin, callback) {
            if (originsWhitelist.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    };

    app.enableCors(corsOptions);
};
