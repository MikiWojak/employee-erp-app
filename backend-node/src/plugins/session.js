const di = require('../../src/di');

const client = di.get('redisSessionClient');

const session = require('express-session');
const redisStore = require('connect-redis')(session);

const sessionOptions = {
    secret: 'secret',
    saveUninitialized: false,
    resave: true,
    store: new redisStore({
        client
    })
};

module.exports = sessionOptions;
