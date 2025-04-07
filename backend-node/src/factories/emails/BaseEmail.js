class BaseEmail {
    _template = 'base';
    _subject = 'Base Email';

    generate(to, data = {}) {
        const context = this._generate(data);

        return {
            to,
            subject: this._subject,
            template: this._template,
            context
        };
    }

    _generate(data) {
        throw new Error('Implement this function in child class!');
    }
}

module.exports = BaseEmail;
