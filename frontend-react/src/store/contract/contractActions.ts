import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StatusCodes as HTTP } from 'http-status-codes';

import axios from '@/plugins/axios';

import type {
    Contract,
    ValidationError,
    IndexRequestParams,
    SingleApiErrorMessage,
    ContractAddEditErrorResponse
} from '@/types';

const mapServerValidationErrors = (errors: SingleApiErrorMessage[]) => {
    const mappedErrors: ContractAddEditErrorResponse = {};

    errors.forEach(({ param, message }: SingleApiErrorMessage) => {
        mappedErrors[param as keyof ContractAddEditErrorResponse] = message;
    });

    return mappedErrors;
};

export const index = createAsyncThunk(
    'contracts/index',
    async ({ page = 1 }: IndexRequestParams) => {
        try {
            const { data } = await axios.get('/contracts', {
                params: {
                    page,
                    perPage: 10
                }
            });

            return { data, page };
        } catch (err) {
            toast.error('Cannot get a list of contracts!');

            throw err;
        }
    }
);

export const store = createAsyncThunk(
    'contracts/store',
    async (data: Contract, { rejectWithValue }) => {
        try {
            const { data: contract } = await axios.post('/contracts', data);

            toast.success('Contract has been added');

            return { contract };
        } catch (err) {
            const error = err as AxiosError<ValidationError>;
            const serverErrors = error.response?.data?.errors;

            if (error.response?.status === HTTP.BAD_REQUEST && serverErrors) {
                const mappedErrors = mapServerValidationErrors(serverErrors);

                return rejectWithValue(mappedErrors);
            }

            toast.error('Error while adding the contract!');

            throw err;
        }
    }
);

export const update = createAsyncThunk(
    'contracts/update',
    async (data: Contract, { rejectWithValue }) => {
        try {
            const { data: contract } = await axios.put(
                `/contracts/${data.id}`,
                data
            );

            toast.success('Contract has been modified');

            return { contract };
        } catch (err) {
            const error = err as AxiosError<ValidationError>;
            const serverErrors = error.response?.data?.errors;

            if (error.response?.status === HTTP.BAD_REQUEST && serverErrors) {
                const mappedErrors = mapServerValidationErrors(serverErrors);

                return rejectWithValue(mappedErrors);
            }

            toast.error('Error while modifying the contract!');

            throw err;
        }
    }
);

export const destroy = createAsyncThunk(
    'contracts/destroy',
    async (id: string) => {
        try {
            await axios.delete(`/contracts/${id}`);

            toast.success('Contract has been deleted');
        } catch (err) {
            toast.error('Error while deleting the contract!');

            throw err;
        }
    }
);
