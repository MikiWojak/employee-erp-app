const { body } = require('express-validator');

const update = [
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength({ min: 2, max: 255 })
        .withMessage('This field must have between 2 and 255 characters.')
        .bail()
        .custom(
            async (
                name,
                {
                    req: {
                        app,
                        params: { id }
                    }
                }
            ) => {
                const di = app.get('di');
                const departmentRepository = di.get('repositories.department');
                const department = await departmentRepository.findByName(name);

                if (department && department.id !== id) {
                    return Promise.reject('Department already exists.');
                }
            }
        )
];

const store = update;

module.exports = {
    store,
    update
};
