'use client';

import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { store } from '@/store';

interface Props {
    children: ReactNode;
}

const ReduxProvider: FC<Props> = ({ children }) => (
    <>
        <Provider store={store}>{children}</Provider>

        <ToastContainer position="bottom-center" theme="colored" />
    </>
);

export default ReduxProvider;
