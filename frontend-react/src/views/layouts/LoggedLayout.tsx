import { FC, ReactNode, useState } from 'react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

interface Props {
    children?: ReactNode;
}

const LoggedLayout: FC<Props> = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

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

export default LoggedLayout;
