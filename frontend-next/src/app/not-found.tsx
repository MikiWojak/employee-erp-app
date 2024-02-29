import { FC } from 'react';
import Link from 'next/link';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const NotFoundPage: FC = () => {
    return (
        <div className="flex h-screen bg-slate-800 items-center justify-center">
            <div className="m-6 p-6 bg-white rounded-lg flex flex-col items-center">
                <ExclamationCircleIcon className="w-12 h-12 text-red-500" />

                <h2 className="text-2xl font-bold text-red-500">
                    Page not found!
                </h2>

                <Link
                    href="/"
                    className="mt-4 flex items-center px-4 py-2 bg-sky-500 rounded-lg text-white hover:bg-sky-600"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
