import * as Yup from 'yup';

const LoginValidation = Yup.object({
    email: Yup.string()
        .required('This field is required.')
        .email('Wrong email format.'),
    password: Yup.string()
        .required('This field is required.')
        .min(8, 'This field must have at least 8 letters.')
});

export default LoginValidation;
