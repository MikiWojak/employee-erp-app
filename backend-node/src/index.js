const {
    app: { url, port }
} = require('./config/index');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const di = require('./di');

const corsOptions = require('./plugins/cors');
const sessionOptions = require('./plugins/session');
const errorHandler = require('./plugins/errorHandler');
const router = require('./routes')(di);

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

const server = app.listen(port, () => {
    console.log(`Example app listening at ${url}`);
});

module.exports = server;
