import { createSlice, SerializedError } from '@reduxjs/toolkit';

import { login, logout, me } from '@/store/auth/authActions';

import type { LoggedUser, LoginErrorResponse } from '@/types';

const loggedUserJson = localStorage.getItem('loggedUser');
const loggedUser: LoggedUser = loggedUserJson
    ? JSON.parse(loggedUserJson)
    : null;

interface InitState {
    loggedUser: LoggedUser;
    loggedIn: boolean;
    isAdmin: boolean;
    errors: LoginErrorResponse | SerializedError;
}

const initialState: InitState = {
    loggedUser,
    loggedIn: !!loggedUser,
    isAdmin: loggedUser?.role?.name === 'admin',
    errors: {}
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.loggedUser = action.payload;
            state.loggedIn = true;
            state.isAdmin = action.payload.role?.name === 'admin';
            state.errors = {};
        });

        builder.addCase(login.rejected, (state, action) => {
            state.errors = action.payload ? action.payload : action.error;
        });

        builder.addCase(logout.fulfilled, state => {
            state.loggedUser = null;
            state.loggedIn = false;
            state.isAdmin = false;
        });

        builder.addCase(me.fulfilled, (state, action) => {
            state.loggedUser = action.payload;
            state.loggedIn = true;
            state.isAdmin = action.payload.role?.name === 'admin';
        });

        builder.addCase(me.rejected, state => {
            state.loggedUser = null;
            state.loggedIn = false;
            state.isAdmin = false;
        });
    }
});

export default authSlice.reducer;
