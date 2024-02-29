import { createSlice, SerializedError } from '@reduxjs/toolkit';

import {
    index,
    store,
    update,
    destroy
} from '@/store/contract/contractActions';

import type { Contract, ContractAddEditErrorResponse } from '@/types';

interface InitState {
    items: Contract[];
    count: number;
    page: number;
    perPage: number;
    isSuccess: boolean;
    errors: ContractAddEditErrorResponse | SerializedError;
}

const initialState: InitState = {
    items: [],
    page: 1,
    perPage: 10,
    count: 0,
    isSuccess: false,
    errors: {}
};

export const contractSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        clear: () => {
            return initialState;
        },

        clearOnCloseModal: state => {
            state.errors = {};
            state.isSuccess = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(index.fulfilled, (state, action) => {
            state.items = action.payload?.data.rows;
            state.count = action.payload?.data.count;
            state.page = action.payload?.page || 1;
        });

        builder.addCase(index.rejected, state => {
            state.items = [];
            state.count = 0;
            state.page = 1;
        });

        builder.addCase(store.fulfilled, state => {
            state.errors = {};
            state.isSuccess = true;
        });

        builder.addCase(store.rejected, (state, action) => {
            state.errors = action.payload ? action.payload : action.error;
            state.isSuccess = false;
        });

        builder.addCase(update.fulfilled, state => {
            state.errors = {};
            state.isSuccess = true;
        });

        builder.addCase(update.rejected, (state, action) => {
            state.errors = action.payload ? action.payload : action.error;
            state.isSuccess = false;
        });

        builder.addCase(destroy.fulfilled, state => {
            state.isSuccess = true;
        });

        builder.addCase(destroy.rejected, state => {
            state.isSuccess = false;
        });
    }
});

export const { clear, clearOnCloseModal } = contractSlice.actions;
export default contractSlice.reducer;
