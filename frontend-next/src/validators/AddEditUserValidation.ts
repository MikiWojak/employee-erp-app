import * as Yup from 'yup';

import { User } from '@/types';

const AddEditUserValidation = (user: User | null) => {
    return Yup.object({
        firstName: Yup.string()
            .required('This field is required.')
            .min(2, 'This field must have at least 2 letters.')
            .max(64, 'This field must have max 64 letters.'),
        lastName: Yup.string()
            .required('This field is required.')
            .min(2, 'This field must have at least 2 letters.')
            .max(64, 'This field must have max 64 letters.'),
        dateOfBirth: Yup.string().required('This field is required.'),
        email: Yup.string()
            .required('This field is required.')
            .email('Wrong email format.'),
        password: Yup.string()
            .test('', 'Field is required', password => {
                if (!user && !password) {
                    return false;
                }

                if (user || password) {
                    return true;
                }
            })
            .min(8, 'This field must have at least 8 letters.')
    });
};

export default AddEditUserValidation;
