import { Formik } from 'formik';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '@/store/auth/authActions';
import { AppDispatch, RootState } from '@/store';
import DisplayErrors from '@/components/DisplayErrors';
import DefaultLayout from '@/views/layouts/DefaultLayout';
import LoginValidation from '@/validators/LoginValidation';

import type { LoginErrorResponse } from '@/types';

const Login: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { errors, loggedIn } = useSelector((state: RootState) => state.auth);
    const serverErrors = errors as LoginErrorResponse;

    useEffect(() => {
        if (loggedIn) {
            navigate('/');
        }
    }, [loggedIn]);

    return (
        <DefaultLayout>
            <h1 className="text-2xl font-bold text-center">Login</h1>

            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginValidation}
                onSubmit={values => dispatch(login(values))}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="block w-full p-2 border-2 border-gray-500 rounded focus:outline-none focus:border-sky-500"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                            />
                        </div>

                        <DisplayErrors
                            error={serverErrors?.email}
                            name="email"
                        />

                        <div className="mt-4">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="block w-full p-2 border-2 border-gray-500 rounded focus:outline-none focus:border-sky-500"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                        </div>

                        <DisplayErrors
                            error={serverErrors?.password}
                            name="password"
                        />

                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-sky-500 rounded-lg text-white hover:bg-sky-600"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </DefaultLayout>
    );
};

export default Login;
