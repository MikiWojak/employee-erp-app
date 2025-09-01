const { StatusCodes: HTTP } = require('http-status-codes');

function loggedOnly(...permittedRolesRaw) {
    return async (req, res, next) => {
        const di = req.app.get('di');
        const checkIfUserLoggedInHandler = di.get(
            'services.checkIfUserLoggedIn'
        );
        const loggedUser = await checkIfUserLoggedInHandler.handle(req);

        if (!loggedUser) {
            return res.sendStatus(HTTP.UNAUTHORIZED);
        }

        const rolesInfo = await loggedUser.rolesInfo();

        req.loggedUser = loggedUser;
        req.rolesInfo = rolesInfo;

        const permittedRoles = Array.isArray(permittedRolesRaw)
            ? permittedRolesRaw
            : [permittedRolesRaw];

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
