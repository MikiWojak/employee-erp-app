const bcrypt = require('bcrypt');
const { StatusCodes: HTTP } = require('http-status-codes');

class LoginController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            session,
            body: { email, password }
        } = req;

        const user = await this.userRepository.findByEmail(email, {
            attributes: ['email', 'password']
        });

        if (!user?.password) {
            return res.sendStatus(HTTP.UNAUTHORIZED);
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.sendStatus(HTTP.UNAUTHORIZED);
        }

        const loggedUser = await this.userRepository.findByEmail(email, {
            include: [
                {
                    association: 'role',
                    required: true
                }
            ]
        });

        session.loggedUser = loggedUser;

        return res.send(loggedUser);
    }
}

module.exports = LoginController;
