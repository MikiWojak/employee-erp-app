import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().required(),
    APP_URL: Joi.string().required(),
    APP_FRONTEND_URL: Joi.string().required(),

    SESSION_SECRET: Joi.string().required(),

    DATABASE_NAME: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_ROOT_PASSWORD: Joi.string().required(),
    TYPEORM_LOGGING: Joi.boolean().required(),

    SESSION_REDIS_HOST: Joi.string().required(),
    SESSION_REDIS_PORT: Joi.number().required(),
    SESSION_REDIS_PASS: Joi.string().required(),
    SESSION_REDIS_TTL: Joi.number().required()
});
