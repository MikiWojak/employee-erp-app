import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import { RootState } from '@/store';

import LoggedLayout from '@/views/layouts/LoggedLayout';
import DefaultLayout from '@/views/layouts/DefaultLayout';

const NotFound: FC = () => {
    const { loggedUser } = useSelector((state: RootState) => state.auth);

    const pageNotFoundContent = (
        <div className="flex flex-col items-center">
            <ExclamationCircleIcon className="w-12 h-12 text-red-500" />

            <h2 className="text-2xl font-bold text-red-500">Page not found!</h2>

            <Link
                to="/"
                className="mt-4 flex items-center px-4 py-2 bg-sky-500 rounded-lg text-white hover:bg-sky-600"
            >
                Return to Home Page
            </Link>
        </div>
    );

    return loggedUser ? (
        <LoggedLayout>{pageNotFoundContent}</LoggedLayout>
    ) : (
        <DefaultLayout>{pageNotFoundContent}</DefaultLayout>
    );
};

export default NotFound;
