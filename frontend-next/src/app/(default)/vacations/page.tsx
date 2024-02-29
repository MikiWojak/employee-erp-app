'use client';

import Pagination from 'react-js-pagination';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    index as getVacations,
    destroy as deleteVacation
} from '@/store/vacation/vacationActions';
import { AppDispatch, RootState } from '@/store';
import VacationTable from '@/components/vacations/Table';
import { clearOnCloseModal } from '@/store/vacation/vacationSlice';
import AddEditVacationModal from '@/components/vacations/AddEditModal';
import DeleteVacationModal from '@/components/modals/DeleteConfirmation';

import type { Vacation } from '@/types';

const VacationsPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isAdminFlag, setIsAdminFlag] = useState<boolean>(false);
    const [vacationsList, setVacationsList] = useState<Vacation[]>([]);
    const [selectedVacation, setSelectedVacation] = useState<Vacation | null>(
        null
    );
    const [isAddEditVacationModalOpen, setIsAddEditVacationModalOpen] =
        useState<boolean>(false);
    const [isDeleteVacationModal, setIsDeleteVacationModal] =
        useState<boolean>(false);

    const { isAdmin } = useSelector((state: RootState) => state.auth);
    const {
        items: vacations,
        perPage,
        count
    } = useSelector((state: RootState) => state.vacations);

    useEffect(() => {
        setIsAdminFlag(isAdmin);

        doGetVacations(currentPage);
    }, []);

    useEffect(() => {
        setVacationsList(vacations);
    }, [vacations]);

    const doGetVacations = async (page: number) => {
        dispatch(getVacations({ page }));
        setCurrentPage(page);
    };

    const openEditVacationModal = (vacation: Vacation) => {
        setSelectedVacation(vacation);
        setIsAddEditVacationModalOpen(true);
    };

    const openDeleteVacationModal = (vacation: Vacation) => {
        setSelectedVacation(vacation);
        setIsDeleteVacationModal(true);
    };

    const doDeleteVacation = async (id: string) => {
        dispatch(deleteVacation(id));
    };

    const handleCloseModal = () => {
        setSelectedVacation(null);
        dispatch(clearOnCloseModal());
    };

    return (
        <div>
            <VacationTable
                isAdmin={isAdminFlag}
                vacations={vacationsList}
                handleOpenAddEditModal={() => {
                    setIsAddEditVacationModalOpen(true);
                }}
                handleEditVacation={openEditVacationModal}
                handleDeleteVacation={openDeleteVacationModal}
            />

            <AddEditVacationModal
                selectedVacation={selectedVacation}
                isModalOpen={isAddEditVacationModalOpen}
                handleCloseModal={handleCloseModal}
                setIsModalOpen={setIsAddEditVacationModalOpen}
                handleGetVacations={() => doGetVacations(currentPage)}
            />

            <DeleteVacationModal
                stateName="vacations"
                isModalOpen={isDeleteVacationModal}
                selectedItemId={selectedVacation?.id}
                confirmationMessage="Do you really want to delete this vacation?"
                handleCloseModal={handleCloseModal}
                setIsModalOpen={setIsDeleteVacationModal}
                handleDeleteItem={(id: string) => doDeleteVacation(id)}
                handleGetItems={() => {
                    doGetVacations(currentPage);
                }}
            />

            <div className="mt-4 flex justify-center">
                <Pagination
                    innerClass="flex"
                    linkClass="p-1 hover:text-slate-300"
                    activeClass="text-sky-500"
                    disabledClass="font-bold"
                    activePage={currentPage}
                    itemsCountPerPage={perPage}
                    totalItemsCount={count}
                    pageRangeDisplayed={5}
                    onChange={doGetVacations}
                />
            </div>
        </div>
    );
};

export default VacationsPage;
