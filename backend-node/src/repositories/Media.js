const AbstractRepository = require('./AbstractRepository');

class MediaRepository extends AbstractRepository {
    get model() {
        return this.db.Media;
    }

    async checkIfUsed(id) {
        const mediaUsed = await this.findById(id, {
            include: [
                {
                    association: 'users',
                    paranoid: false,
                    attributes: [],
                    required: true
                }
            ]
        });

        return !!mediaUsed;
    }
}

module.exports = MediaRepository;
