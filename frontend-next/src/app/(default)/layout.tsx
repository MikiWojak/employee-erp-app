'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FC, ReactNode, useState, useEffect } from 'react';

import { RootState } from '@/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

interface Props {
    children?: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
    const { push } = useRouter();

    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

    const { loggedIn } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!loggedIn) {
            push('/login');
        }
    }, [loggedIn]);

    return (
        <div className="flex w-full h-screen bg-slate-800 text-white">
            <Header handleSetIsSidebarVisible={setIsSidebarVisible} />

            <div className="flex w-full mt-16 mb-10">
                {isSidebarVisible && <Sidebar />}

                <main className="w-full m-4">{children}</main>
            </div>

            <Footer />
        </div>
    );
};

export default DefaultLayout;
