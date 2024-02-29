module.exports = (request, email, password) => {
    return request.post('/api/auth/login').send({ email, password });
};
