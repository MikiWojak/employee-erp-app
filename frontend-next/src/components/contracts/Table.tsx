import dayjs from 'dayjs';
import { FC } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

import type { Contract } from '@/types';

interface Props {
    isAdmin: boolean;
    contracts: Contract[];
    handleOpenAddEditModal: () => void;
    handleEditContract: (contract: Contract) => void;
    handleDeleteContract: (contract: Contract) => void;
}

const ContractsTable: FC<Props> = ({
    isAdmin,
    contracts,
    handleEditContract,
    handleDeleteContract,
    handleOpenAddEditModal
}) => {
    const contractsRows = contracts.map(contract => {
        const {
            id,
            position,
            startDate,
            endDate,
            vacationDaysPerYear,
            vacationDays,
            user
        } = contract;

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
                <td className="p-2 border border-slate-700">{position}</td>
                <td className="p-2 border border-slate-700">
                    {dayjs(startDate).format('DD.MM.YYYY')}
                </td>
                <td className="p-2 border border-slate-700">
                    {dayjs(endDate).format('DD.MM.YYYY')}
                </td>
                <td className="p-2 border border-slate-700">
                    {vacationDaysPerYear}
                </td>
                <td className="p-2 border border-slate-700">{vacationDays}</td>
                {isAdmin && (
                    <td className="p-2 border border-slate-700">
                        <div className="flex items-center justify-center">
                            <button
                                className="w-4 h-4 mr-2 hover:text-slate-300"
                                onClick={() => handleEditContract(contract)}
                            >
                                <PencilIcon />
                            </button>
                            <button
                                className="w-4 h-4 hover:text-slate-300"
                                onClick={() => handleDeleteContract(contract)}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </td>
                )}
            </tr>
        );
    });

    return (
        <div>
            <h2 className="text-2xl font-bold">Contracts</h2>

            {isAdmin && (
                <button
                    className="mt-4 p-2 bg-white text-black rounded-lg hover:bg-slate-300"
                    onClick={handleOpenAddEditModal}
                >
                    Add contract
                </button>
            )}

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
                            Position
                        </th>
                        <th className="p-2 border border-slate-600">
                            Start date
                        </th>
                        <th className="p-2 border border-slate-600">
                            End date
                        </th>
                        <th className="p-2 border border-slate-600">
                            Days off/year
                        </th>
                        <th className="p-2 border border-slate-600">
                            Days off
                        </th>
                        {isAdmin && (
                            <th className="p-2 border border-slate-600">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="text-center">{contractsRows}</tbody>
            </table>
        </div>
    );
};

export default ContractsTable;
