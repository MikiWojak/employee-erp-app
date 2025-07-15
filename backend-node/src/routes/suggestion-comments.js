const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const validate = require('../middlewares/validate');
const loggedOnly = require('../middlewares/loggedOnly');
const suggestionCommentValidator = require('../validators/suggestion-comment');

module.exports = di => {
    const updateController = di.get('controllers.suggestionComments.update');
    const destroyController = di.get('controllers.suggestionComments.destroy');

    router.put(
        '/:id',
        loggedOnly(),
        [suggestionCommentValidator.update, validate],
        invoke(updateController)
    );

    router.delete('/:id', loggedOnly(), invoke(destroyController));

    return router;
};
