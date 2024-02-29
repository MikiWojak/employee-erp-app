import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StatusCodes as HTTP } from 'http-status-codes';

import axios from '@/plugins/axios';

import type {
    LoginRequest,
    ValidationError,
    LoginErrorResponse,
    SingleApiErrorMessage
} from '@/types';

export const login = createAsyncThunk(
    'auth/login',
    async (data: LoginRequest, { rejectWithValue }) => {
        try {
            const { data: loggedUser } = await axios.post('/auth/login', data);

            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

            toast.success('Logged in successfully');

            return loggedUser;
        } catch (err) {
            const error = err as AxiosError<ValidationError>;
            const errorsArray = error.response?.data?.errors;

            if (error.response?.status === HTTP.BAD_REQUEST && errorsArray) {
                const mappedErrors: LoginErrorResponse = {};

                errorsArray.forEach(
                    ({ param, message }: SingleApiErrorMessage) => {
                        mappedErrors[param as keyof LoginErrorResponse] =
                            message;
                    }
                );

                toast.error('Invalid credentials!');

                return rejectWithValue(mappedErrors);
            }

            if (error.response?.status === HTTP.UNAUTHORIZED) {
                toast.error('Mismatching credentials!');

                throw err;
            }

            toast.error('Something went wrong...');

            throw err;
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await axios.post('/auth/logout');

        localStorage.removeItem('loggedUser');

        toast.info('Logged out');
    } catch (err) {
        toast.error('Error while logging out!');

        throw err;
    }
});

export const me = createAsyncThunk('auth/me', async () => {
    try {
        const { data: loggedUser } = await axios.get('/auth/me');

        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        return loggedUser;
    } catch (err) {
        throw err;
    }
});
