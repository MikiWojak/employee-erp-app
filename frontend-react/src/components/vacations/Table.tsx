import { FC } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

import type { Vacation } from '@/types';

interface Props {
    isAdmin: boolean;
    vacations: Vacation[];
    handleOpenAddEditModal: () => void;
    handleEditVacation: (vacation: Vacation) => void;
    handleDeleteVacation: (vacation: Vacation) => void;
}

const VacationsTable: FC<Props> = ({
    isAdmin,
    vacations,
    handleEditVacation,
    handleDeleteVacation,
    handleOpenAddEditModal
}) => {
    const vacationsRows = vacations.map(vacation => {
        const { id, startDate, endDate, duration, approved, user } = vacation;
        const areActionsDisabled = !isAdmin && approved;
        const actionsClasses = areActionsDisabled
            ? 'text-slate-500'
            : 'hover:text-slate-300';

        return (
            <tr key={id} className="hover:bg-slate-600">
                {isAdmin && (
                    <>
                        <td className="p-2 border border-slate-700">
                            {user?.firstName}
                        </td>
                        <td className="p-2 border border-slate-700">
                            {user?.lastName}
                        </td>
                    </>
                )}
                <td className="p-2 border border-slate-700">{startDate}</td>
                <td className="p-2 border border-slate-700">{endDate}</td>
                <td className="p-2 border border-slate-700">{duration}</td>
                <td className="p-2 border border-slate-700">
                    {approved ? (
                        <span className="px-2 py-1 rounded-full bg-green-600">
                            Approved
                        </span>
                    ) : (
                        <span className="px-2 py-1 rounded-full bg-orange-500">
                            Pending
                        </span>
                    )}
                </td>
                <td className="p-2 border border-slate-700">
                    <div className="flex items-center justify-center">
                        <button
                            className={`w-4 h-4 mr-2 ${actionsClasses}`}
                            disabled={areActionsDisabled}
                            onClick={() => handleEditVacation(vacation)}
                        >
                            <PencilIcon />
                        </button>
                        <button
                            className={`w-4 h-4 ${actionsClasses}`}
                            disabled={areActionsDisabled}
                            onClick={() => handleDeleteVacation(vacation)}
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
            <h2 className="text-2xl font-bold">Vacations</h2>

            <button
                className="mt-4 p-2 bg-white text-black rounded-lg hover:bg-slate-300"
                onClick={handleOpenAddEditModal}
            >
                Add vacation
            </button>

            <table className="w-full mt-2 table-auto border-collapse border border-slate-500">
                <thead className="bg-slate-700">
                    <tr>
                        {isAdmin && (
                            <>
                                <th className="p-2 border border-slate-600">
                                    First name
                                </th>
                                <th className="p-2 border border-slate-600">
                                    Last name
                                </th>
                            </>
                        )}
                        <th className="p-2 border border-slate-600">
                            Start date
                        </th>
                        <th className="p-2 border border-slate-600">
                            End date
                        </th>
                        <th className="p-2 border border-slate-600">
                            Duration
                        </th>
                        <th className="p-2 border border-slate-600">Status</th>
                        <th className="p-2 border border-slate-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-center">{vacationsRows}</tbody>
            </table>
        </div>
    );
};

export default VacationsTable;
