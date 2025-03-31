const BaseEmail = require('./BaseEmail');

class UserStoreEmail extends BaseEmail {
    _template = 'user_store';
    _subject = 'Welcome';

    _generate({ firstName, lastName }) {
        return {
            fullName: `${firstName} ${lastName}`
        };
    }
}

module.exports = UserStoreEmail;
