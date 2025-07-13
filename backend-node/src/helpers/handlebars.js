const Handlebars = require('handlebars');

module.exports = {
    // https://handlebarsjs.com/examples/helper-multiple-parameters.html
    link: (text, url) => {
        const urlProcessed = Handlebars.escapeExpression(url);
        const textProcessed = Handlebars.escapeExpression(text);

        return new Handlebars.SafeString(
            `<a href="${urlProcessed}"> ${textProcessed} </a>`
        );
    }
};
