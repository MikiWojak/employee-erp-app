class GetLoggedInUserHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    handle(req) {
        let currentUserId;

        if (!req.session || !req.session.loggedUser) {
            return null;
        }

        currentUserId = req.session.loggedUser.id;

        if (!currentUserId) {
            return null;
        }

        return this.userRepository.getById(currentUserId);
    }
}

module.exports = GetLoggedInUserHandler;
