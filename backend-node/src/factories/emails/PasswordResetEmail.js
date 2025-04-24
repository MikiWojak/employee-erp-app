const BaseEmail = require('./BaseEmail');

class PasswordResetEmail extends BaseEmail {
    _template = 'password_reset';
    _subject = 'Reset your password';

    _generate({ firstName, resetPasswordLink }) {
        return { firstName, resetPasswordLink };
    }
}

module.exports = PasswordResetEmail;
