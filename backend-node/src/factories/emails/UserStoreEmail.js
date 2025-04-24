const BaseEmail = require('./BaseEmail');

class UserStoreEmail extends BaseEmail {
    _template = 'user_store';
    _subject = 'Welcome';

    _generate({ firstName, setPasswordLink }) {
        return { firstName, setPasswordLink };
    }
}

module.exports = UserStoreEmail;
