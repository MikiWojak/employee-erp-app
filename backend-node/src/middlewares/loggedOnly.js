const { StatusCodes: HTTP } = require('http-status-codes');

function loggedOnly(...permittedRoles) {
    return async (req, res, next) => {
        const di = req.app.get('di');
        const getLoggedInUserHandler = di.get('services.getLoggedInUser');
        const loggedUser = await getLoggedInUserHandler.handle(req);

        if (!loggedUser) {
            return res.sendStatus(HTTP.UNAUTHORIZED);
        }

        const rolesInfo = await loggedUser.rolesInfo();

        req.loggedUser = loggedUser;
        req.rolesInfo = rolesInfo;

        if (!Array.isArray(permittedRoles)) {
            permittedRoles = [permittedRoles];
        }

        if (
            permittedRoles.length &&
            !permittedRoles.includes(loggedUser.role.name)
        ) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        return next();
    };
}

module.exports = loggedOnly;
