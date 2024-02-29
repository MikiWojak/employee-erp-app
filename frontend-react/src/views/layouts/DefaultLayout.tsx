import { ReactNode, FC } from 'react';

interface Props {
    children?: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-800 items-center justify-center">
            <div className="w-full md:w-3/5 lg:w-2/5 p-4">
                <div className="m-6 p-6 bg-white rounded-lg">{children}</div>
            </div>
        </div>
    );
};

export default DefaultLayout;
