const { StatusCodes: HTTP } = require('http-status-codes');

class LogoutController {
    async invoke(req, res) {
        const { session } = req;

        session.destroy(err => {});

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = LogoutController;
