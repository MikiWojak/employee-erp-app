import { FC } from 'react';

import Card from '@/components/dashboard/Card';

import type { LoggedUser } from '@/types';

interface Props {
    loggedUser: LoggedUser;
}

const EmployeeDashboard: FC<Props> = ({ loggedUser }) => {
    const daysOffAvailable = loggedUser?.vacationDaysSum || 0;
    const daysOffUsed = loggedUser?.vacationDaysUsed || 0;
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
