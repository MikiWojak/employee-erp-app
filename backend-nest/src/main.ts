import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@/AppModule';
import { useCors } from '@/plugins/cors';
import { useSession } from '@/plugins/session';
import { useValidation } from '@/plugins/validation';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get<ConfigService>(ConfigService);
    const appConfig = config.get('app');

    useCors(app);
    useSession(app);
    useValidation(app);

    await app.listen(appConfig.port);
}
bootstrap();
