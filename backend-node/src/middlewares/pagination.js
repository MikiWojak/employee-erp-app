module.exports = (request, response, next) => {
    let { page = 1, perPage = 10 } = request.query;

    page = parseInt(page);
    perPage = parseInt(perPage);

    const offset = (page - 1) * perPage;
    const limit = perPage;

    request.pagination = {
        offset,
        limit
    };

    return next();
};
