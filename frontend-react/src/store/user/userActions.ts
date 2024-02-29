import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StatusCodes as HTTP } from 'http-status-codes';

import axios from '@/plugins/axios';

import type {
    User,
    ValidationError,
    IndexRequestParams,
    SingleApiErrorMessage,
    UserAddEditErrorResponse
} from '@/types';

const mapServerValidationErrors = (errors: SingleApiErrorMessage[]) => {
    const mappedErrors: UserAddEditErrorResponse = {};

    errors.forEach(({ param, message }: SingleApiErrorMessage) => {
        mappedErrors[param as keyof UserAddEditErrorResponse] = message;
    });

    return mappedErrors;
};

export const index = createAsyncThunk(
    'users/index',
    async ({ page = 1, search = '' }: IndexRequestParams) => {
        try {
            const { data } = await axios.get('/users', {
                params: {
                    page,
                    q: search || '',
                    perPage: 10
                }
            });

            return { data, page };
        } catch (err) {
            toast.error('Cannot get a list of users!');

            throw err;
        }
    }
);

export const store = createAsyncThunk(
    'users/store',
    async (data: User, { rejectWithValue }) => {
        try {
            const { data: user } = await axios.post('/users', data);

            toast.success('User has been added');

            return { user };
        } catch (err) {
            const error = err as AxiosError<ValidationError>;
            const serverErrors = error.response?.data?.errors;

            if (error.response?.status === HTTP.BAD_REQUEST && serverErrors) {
                const mappedErrors = mapServerValidationErrors(serverErrors);

                return rejectWithValue(mappedErrors);
            }

            toast.error('Error while adding the user!');

            throw err;
        }
    }
);

export const update = createAsyncThunk(
    'users/update',
    async (data: User, { rejectWithValue }) => {
        try {
            const { data: user } = await axios.put(`/users/${data.id}`, data);

            toast.success('User has been modified');

            return { user };
        } catch (err) {
            const error = err as AxiosError<ValidationError>;
            const serverErrors = error.response?.data?.errors;

            if (error.response?.status === HTTP.BAD_REQUEST && serverErrors) {
                const mappedErrors = mapServerValidationErrors(serverErrors);

                return rejectWithValue(mappedErrors);
            }

            toast.error('Error while modifying the user!');

            throw err;
        }
    }
);

export const destroy = createAsyncThunk('users/destroy', async (id: string) => {
    try {
        await axios.delete(`/users/${id}`);

        toast.success('User has been deleted');
    } catch (err) {
        toast.error('Error while deleting the user!');

        throw err;
    }
});
