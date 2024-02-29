import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StatusCodes as HTTP } from 'http-status-codes';

import axios from '@/plugins/axios';

import type {
    Vacation,
    ValidationError,
    IndexRequestParams,
    SingleApiErrorMessage,
    VacationAddEditErrorResponse
} from '@/types';

const mapServerValidationErrors = (errors: SingleApiErrorMessage[]) => {
    const mappedErrors: VacationAddEditErrorResponse = {};

    errors.forEach(({ param, message }: SingleApiErrorMessage) => {
        mappedErrors[param as keyof VacationAddEditErrorResponse] = message;
    });

    return mappedErrors;
};

export const index = createAsyncThunk(
    'vacations/index',
    async ({ page = 1 }: IndexRequestParams) => {
        try {
            const { data } = await axios.get('/vacations', {
                params: {
                    page,
                    perPage: 10
                }
            });

            return { data, page };
        } catch (err) {
            toast.error('Cannot get a list of vacations!');

            throw err;
        }
    }
);

export const store = createAsyncThunk(
    'vacations/store',
    async (data: Vacation, { rejectWithValue }) => {
        try {
            const { data: vacation } = await axios.post('/vacations', data);

            toast.success('Vacation has been added');

            return { vacation };
        } catch (err) {
            const error = err as AxiosError<ValidationError>;
            const serverErrors = error.response?.data?.errors;

            if (error.response?.status === HTTP.BAD_REQUEST && serverErrors) {
                const mappedErrors = mapServerValidationErrors(serverErrors);

                return rejectWithValue(mappedErrors);
            }

            toast.error('Error while adding the vacation!');

            throw err;
        }
    }
);

export const update = createAsyncThunk(
    'vacations/update',
    async (data: Vacation, { rejectWithValue }) => {
        try {
            const { data: vacation } = await axios.put(
                `/vacations/${data.id}`,
                data
            );

            toast.success('Vacation has been modified');

            return { vacation };
        } catch (err) {
            const error = err as AxiosError<ValidationError>;
            const serverErrors = error.response?.data?.errors;

            if (error.response?.status === HTTP.BAD_REQUEST && serverErrors) {
                const mappedErrors = mapServerValidationErrors(serverErrors);

                return rejectWithValue(mappedErrors);
            }

            toast.error('Error while modifying the vacation!');

            throw err;
        }
    }
);

export const destroy = createAsyncThunk(
    'vacations/destroy',
    async (id: string) => {
        try {
            await axios.delete(`/vacations/${id}`);

            toast.success('Vacation has been deleted');
        } catch (err) {
            toast.error('Error while deleting the vacation!');

            throw err;
        }
    }
);
