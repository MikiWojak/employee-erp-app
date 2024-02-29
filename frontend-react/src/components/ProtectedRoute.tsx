import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

import { RootState } from '@/store';

const ProtectedRoute: FC = () => {
    const { loggedIn } = useSelector((state: RootState) => state.auth);

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
