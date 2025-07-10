const { fn, col } = require('sequelize');
const { StatusCodes: HTTP } = require('http-status-codes');

class MeController {
    constructor(userRepository, vacationRepository) {
        this.userRepository = userRepository;
        this.vacationRepository = vacationRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser: { id }
        } = req;

        const user = await this.userRepository.getById(id);

        if (!user) {
            return res.sendStatus(HTTP.UNAUTHORIZED);
        }

        const [vacationSummaryRaw] = await this.vacationRepository.findAll({
            where: {
                userId: id,
                approved: false
            },
            attributes: [
                [
                    fn('COALESCE', fn('SUM', col('duration')), 0),
                    'vacationDaysPending'
                ]
            ],
            raw: true
        });

        const vacationSummary = {};

        for (const key in vacationSummaryRaw) {
            vacationSummary[key] = parseInt(vacationSummaryRaw[key]);
        }

        return res.send({ user, vacationSummary });
    }
}

module.exports = MeController;
