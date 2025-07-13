const Handlebars = require('handlebars');

module.exports = {
    link: (text, url) => {
        const urlProcessed = Handlebars.escapeExpression(url);
        const textProcessed = Handlebars.escapeExpression(text);

        return new Handlebars.SafeString(
            `<a href="${urlProcessed}"> ${textProcessed} </a>`
        );
    }
};
