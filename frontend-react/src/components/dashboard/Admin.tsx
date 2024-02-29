import { FC } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

import type { User } from '@/types';

interface Props {
    users: User[];
    handleOpenAddEditModal: () => void;
    handleEditUser: (user: User) => void;
    handleDeleteUser: (user: User) => void;
}

const AdminDashboard: FC<Props> = ({
    users,
    handleEditUser,
    handleDeleteUser,
    handleOpenAddEditModal
}) => {
    const usersRows = users.map(user => {
        const {
            id,
            firstName,
            lastName,
            dateOfBirth,
            email,
            vacationDaysSum,
            vacationDaysUsed
        } = user;
        const daysOffLeft = (vacationDaysSum || 0) - (vacationDaysUsed || 0);

        const backgroundColor =
            daysOffLeft > 0
                ? 'bg-green-600'
                : daysOffLeft < 0
                ? 'bg-red-600'
                : 'bg-orange-500';

        return (
            <tr key={id} className="hover:bg-slate-600">
                <td className="p-2 border border-slate-700">{firstName}</td>
                <td className="p-2 border border-slate-700">{lastName}</td>
                <td className="p-2 border border-slate-700">{dateOfBirth}</td>
                <td className="p-2 border border-slate-700">{email}</td>
                <td className="p-2 border border-slate-700">
                    <span
                        className={`px-2 py-1 rounded-full ${backgroundColor}`}
                    >
                        {daysOffLeft}
                    </span>
                </td>
                <td className="p-2 border border-slate-700">
                    <div className="flex items-center justify-center">
                        <button
                            className="w-4 h-4 mr-2 hover:text-slate-300"
                            onClick={() => handleEditUser(user)}
                        >
                            <PencilIcon />
                        </button>
                        <button
                            className="w-4 h-4 hover:text-slate-300"
                            onClick={() => handleDeleteUser(user)}
                        >
                            <TrashIcon />
                        </button>
                    </div>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <h2 className="text-2xl font-bold">Employees</h2>

            <button
                className="mt-4 p-2 bg-white text-black rounded-lg hover:bg-slate-300"
                onClick={handleOpenAddEditModal}
            >
                Add employee
            </button>

            <table className="w-full mt-2 table-auto border-collapse border border-slate-500">
                <thead className="bg-slate-700">
                    <tr>
                        <th className="p-2 border border-slate-600">
                            First name
                        </th>
                        <th className="p-2 border border-slate-600">
                            Last name
                        </th>
                        <th className="p-2 border border-slate-600">
                            Date of birth
                        </th>
                        <th className="p-2 border border-slate-600">Email</th>
                        <th className="p-2 border border-slate-600">
                            Days off left
                        </th>
                        <th className="p-2 border border-slate-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-center">{usersRows}</tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
