import { createSlice, SerializedError } from '@reduxjs/toolkit';

import { index, store, update, destroy } from '@/store/user/userActions';

import type { User, UserAddEditErrorResponse } from '@/types';

interface InitState {
    items: User[];
    count: number;
    page: number;
    perPage: number;
    isSuccess: boolean;
    errors: UserAddEditErrorResponse | SerializedError;
}

const initialState: InitState = {
    items: [],
    page: 1,
    perPage: 10,
    count: 0,
    isSuccess: false,
    errors: {}
};

export const userSlice = createSlice({
    name: 'users',
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

export const { clear, clearOnCloseModal } = userSlice.actions;
export default userSlice.reducer;
