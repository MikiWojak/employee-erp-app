const {
    app: { frontendUrl }
} = require('../config/index');

const originsWhitelist = [frontendUrl];
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

module.exports = corsOptions;
