import * as Yup from 'yup';

const AddEditVacationValidation = (isAdmin: boolean) => {
    return Yup.object({
        userId: Yup.string().test('', 'Field is required', userId => {
            if (isAdmin && !userId) {
                return false;
            }

            if (!isAdmin || userId) {
                return true;
            }
        }),
        startDate: Yup.string().required('This field is required.'),
        endDate: Yup.string().required('This field is required.'),
        approved: Yup.boolean().test('', 'Field is required', approved => {
            if (isAdmin && approved === undefined) {
                return false;
            }

            if (!isAdmin || approved !== undefined) {
                return true;
            }
        })
    });
};

export default AddEditVacationValidation;
