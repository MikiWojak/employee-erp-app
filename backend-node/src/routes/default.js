const express = require('express');
const router = express.Router();
const invoke = require('../middlewares/invoke');

module.exports = di => {
    const welcomeController = di.get('controllers.welcomeController');

    router.get('/', invoke(welcomeController));

    return router;
};
