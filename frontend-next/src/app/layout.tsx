import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

import Provider from '@/app/Provider';

import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@/assets/styles/index.css';
import '@/assets/styles/styles.css';

interface Props {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: 'Employee ERP System',
    description: 'System for managing employees / contracts / vacations'
};

const RootLayout: FC<Props> = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
};

export default RootLayout;
