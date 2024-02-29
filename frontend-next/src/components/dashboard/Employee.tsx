import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { FC, useEffect, useState } from 'react';

import Card from '@/components/dashboard/Card';

import type { LoggedUser } from '@/types';

const EmployeeDashboard: FC = () => {
    const [loggedUserData, setUserData] = useState<LoggedUser>(null);

    const { loggedUser } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setUserData(loggedUser);
    }, []);

    const daysOffAvailable = loggedUserData?.vacationDaysSum || 0;
    const daysOffUsed = loggedUserData?.vacationDaysUsed || 0;
    const daysOffLeft = daysOffAvailable - daysOffUsed;

    return (
        <div className="flex justify-center gap-10 flex-wrap">
            <Card title="Days off sum" value={daysOffAvailable} />
            <Card title="Days off used" value={daysOffUsed} />
            <Card title="Days off left" value={daysOffLeft} />
        </div>
    );
};

export default EmployeeDashboard;
