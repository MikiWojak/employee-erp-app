import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/auth/authSlice';
import userReducer from '@/store/user/userSlice';
import contractReducer from '@/store/contract/contractSlice';
import vacationReducer from '@/store/vacation/vacationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        contracts: contractReducer,
        vacations: vacationReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
