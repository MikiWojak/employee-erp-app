'use client';

import { FC } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '@/store/auth/authActions';
import { AppDispatch, RootState } from '@/store';
import LoginValidation from '@/validators/LoginValidation';
import DisplayErrors from '@/components/forms/DisplayErrors';

import type { LoginErrorResponse } from '@/types';

const LoginPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { errors } = useSelector((state: RootState) => state.auth);
    const serverErrors = errors as LoginErrorResponse;

    return (
        <div>
            <h1 className="text-2xl font-bold text-center">Login</h1>

            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginValidation}
                onSubmit={values => {
                    dispatch(login(values));
                }}
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
        </div>
    );
};

export default LoginPage;
