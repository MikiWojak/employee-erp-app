'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ReactNode, FC, useEffect } from 'react';

import { RootState } from '@/store';

interface Props {
    children?: ReactNode;
}

const LoginLayout: FC<Props> = ({ children }) => {
    const { push } = useRouter();

    const { loggedIn } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (loggedIn) {
            push('/');
        }
    }, [loggedIn]);

    return (
        <div className="flex h-screen bg-slate-800 items-center justify-center">
            <div className="w-full md:w-3/5 lg:w-2/5">
                <div className="m-6 p-6 bg-white rounded-lg">{children}</div>
            </div>
        </div>
    );
};

export default LoginLayout;
