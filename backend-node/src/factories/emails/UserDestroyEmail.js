const BaseEmail = require('./BaseEmail');

class UserDestroyEmail extends BaseEmail {
    _template = 'user_destroy';
    _subject = 'Account has been deleted';

    _generate({ firstName }) {
        return { firstName };
    }
}

module.exports = UserDestroyEmail;
