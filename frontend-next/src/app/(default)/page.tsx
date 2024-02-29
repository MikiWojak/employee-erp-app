'use client';

import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { me } from '@/store/auth/authActions';
import { AppDispatch, RootState } from '@/store';
import AdminDashboard from '@/components/dashboard/Admin';
import { index as getUsers } from '@/store/user/userActions';
import EmployeeDashboard from '@/components/dashboard/Employee';

const DashboardPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [isAdminFlag, setIsAdminFlag] = useState<boolean>(false);

    const { isAdmin } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setIsAdminFlag(isAdmin);

        if (isAdmin) {
            doGetUsers(1);
        }

        getLoggedUser();
    }, []);

    const doGetUsers = async (page: number) => {
        dispatch(getUsers({ page }));
    };

    const getLoggedUser = async () => {
        dispatch(me());
    };

    return (
        <div>
            {isAdminFlag ? (
                <AdminDashboard handleGetUsers={doGetUsers} />
            ) : (
                <EmployeeDashboard />
            )}
        </div>
    );
};

export default DashboardPage;
