const { StatusCodes: HTTP } = require('http-status-codes');
const { validationResult } = require('express-validator');

module.exports = (request, response, next) => {
    const validationErrors = validationResult(request);

    if (validationErrors.isEmpty()) {
        return next();
    }

    const errors = validationErrors.array().map(e => {
        return { message: e.msg, param: e.path };
    });

    return response.status(HTTP.BAD_REQUEST).send({ errors });
};
