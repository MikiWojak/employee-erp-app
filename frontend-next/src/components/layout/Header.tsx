import { FC } from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';

interface Props {
    handleSetIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: FC<Props> = ({ handleSetIsSidebarVisible }) => {
    return (
        <header className="w-full h-16 p-4 fixed top-0 left-0 bg-sky-700 flex gap-4 items-center">
            <button
                className="p-2 rounded-full hover:bg-sky-500"
                onClick={() => handleSetIsSidebarVisible(oldValue => !oldValue)}
            >
                <Bars3Icon className="w-6 h-6" />
            </button>

            <h1 className="text-2xl font-bold">Employee ERP System</h1>
        </header>
    );
};

export default Header;
