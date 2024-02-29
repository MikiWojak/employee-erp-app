'use client';

import Pagination from 'react-js-pagination';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    index as getContracts,
    destroy as deleteContract
} from '@/store/contract/contractActions';
import { AppDispatch, RootState } from '@/store';
import ContractsTable from '@/components/contracts/Table';
import { clearOnCloseModal } from '@/store/contract/contractSlice';
import AddEditContractModal from '@/components/contracts/AddEditModal';
import DeleteContractModal from '@/components/modals/DeleteConfirmation';

import type { Contract } from '@/types';

const ContractsPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isAdminFlag, setIsAdminFlag] = useState<boolean>(false);
    const [contractsList, setContractsList] = useState<Contract[]>([]);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(
        null
    );
    const [isAddEditContractModalOpen, setIsAddEditContractModalOpen] =
        useState<boolean>(false);
    const [isDeleteContractModal, setIsDeleteContractModal] =
        useState<boolean>(false);

    const { isAdmin } = useSelector((state: RootState) => state.auth);
    const {
        items: contracts,
        perPage,
        count
    } = useSelector((state: RootState) => state.contracts);

    useEffect(() => {
        setIsAdminFlag(isAdmin);

        doGetContracts(currentPage);
    }, []);

    useEffect(() => {
        setContractsList(contracts);
    }, [contracts]);

    const doGetContracts = async (page: number) => {
        dispatch(getContracts({ page }));
        setCurrentPage(page);
    };

    const openEditContractModal = (contract: Contract) => {
        setSelectedContract(contract);
        setIsAddEditContractModalOpen(true);
    };

    const openDeleteContractModal = (contract: Contract) => {
        setSelectedContract(contract);
        setIsDeleteContractModal(true);
    };

    const doDeleteContract = async (id: string) => {
        dispatch(deleteContract(id));
    };

    const handleCloseModal = () => {
        setSelectedContract(null);
        dispatch(clearOnCloseModal());
    };

    return (
        <div>
            <ContractsTable
                isAdmin={isAdminFlag}
                contracts={contractsList}
                handleOpenAddEditModal={() =>
                    setIsAddEditContractModalOpen(true)
                }
                handleEditContract={openEditContractModal}
                handleDeleteContract={openDeleteContractModal}
            />

            <AddEditContractModal
                selectedContract={selectedContract}
                isModalOpen={isAddEditContractModalOpen}
                handleCloseModal={handleCloseModal}
                setIsModalOpen={setIsAddEditContractModalOpen}
                handleGetContracts={() => doGetContracts(currentPage)}
            />

            <DeleteContractModal
                stateName="contracts"
                isModalOpen={isDeleteContractModal}
                selectedItemId={selectedContract?.id}
                confirmationMessage="Do you really want to delete this contract?"
                handleCloseModal={handleCloseModal}
                setIsModalOpen={setIsDeleteContractModal}
                handleDeleteItem={(id: string) => doDeleteContract(id)}
                handleGetItems={() => {
                    doGetContracts(currentPage);
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
                    onChange={doGetContracts}
                />
            </div>
        </div>
    );
};

export default ContractsPage;
