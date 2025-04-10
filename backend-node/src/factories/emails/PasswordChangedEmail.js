const BaseEmail = require('./BaseEmail');

class PasswordChangedEmail extends BaseEmail {
    _template = 'password_changed';
    _subject = 'Password has been changed';

    _generate({ firstName }) {
        return { firstName };
    }
}

module.exports = PasswordChangedEmail;
