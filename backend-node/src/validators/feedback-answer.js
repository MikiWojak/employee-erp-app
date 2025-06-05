const { body } = require('express-validator');

const submit = [
    body().custom((value, { req: { app } }) => {
        console.dir({ value }, { depth: null });

        return true;

        // const di = app.get('di');
        // const departmentRepository = di.get('repositories.department');
        // const department =
        //     await departmentRepository.findById(departmentId);
        //
        // if (!department) {
        //     return Promise.reject('Department not found.');
        // }
    })
];

module.exports = {
    submit
};
