import { ValidationPipe } from '@nestjs/common';

export const useValidation = async app => {
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        })
    );
};
