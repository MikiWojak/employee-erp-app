const AbstractRepository = require('./AbstractRepository');

class MediaRepository extends AbstractRepository {
    get model() {
        return this.db.Media;
    }
}

module.exports = MediaRepository;
