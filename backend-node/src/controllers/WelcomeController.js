class WelcomeController {
    invoke(req, res) {
        res.send('Welcome to my NodeJS API');
    }
}

module.exports = WelcomeController;
