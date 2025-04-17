const {
    app: { url, port }
} = require('./config/index');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const di = require('./di');

const corsOptions = require('./plugins/cors');
const sessionOptions = require('./plugins/session');
const errorHandler = require('./plugins/errorHandler');
const router = require('./routes')(di);

const onShutdown = require('./plugins/shutdown');

const app = express();
app.use(cors(corsOptions));
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(session(sessionOptions));

app.set('di', di);

app.use('/api', router);

app.use(errorHandler);

app.use('/public', express.static(path.join(__dirname, '../public')));

const server = app.listen(port, () => {
    console.info(`Example app listening at ${url}`);
});

process.once('SIGINT', async () => onShutdown(di));
process.once('SIGTERM', async () => onShutdown(di));

module.exports = server;
