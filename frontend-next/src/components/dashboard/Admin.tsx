import Pagination from 'react-js-pagination';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/store';
import UsersTable from '@/components/users/Table';
import { clearOnCloseModal } from '@/store/user/userSlice';
import AddEditUserModal from '@/components/users/AddEditModal';
import { destroy as deleteUser } from '@/store/user/userActions';
import DeleteUserModal from '@/components/modals/DeleteConfirmation';

import type { User } from '@/types';

interface Props {
    handleGetUsers: (page: number) => Promise<void>;
}

const AdminDashboard: FC<Props> = ({ handleGetUsers }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [usersList, setUsersList] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteUserModal, setIsDeleteUserModal] = useState<boolean>(false);
    const [isAddEditUserModalOpen, setIsAddEditUserModalOpen] =
        useState<boolean>(false);

    const {
        items: users,
        perPage,
        count
    } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        setUsersList(users);
    }, [users]);

    const onChangePage = async (page: number) => {
        handleGetUsers(page);
        setCurrentPage(page);
    };

    const openEditUserModal = (user: User) => {
        setSelectedUser(user);
        setIsAddEditUserModalOpen(true);
    };

    const openDeleteUserModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteUserModal(true);
    };

    const doDeleteUser = async (id: string) => {
        dispatch(deleteUser(id));
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        dispatch(clearOnCloseModal());
    };

    return (
        <div>
            <UsersTable
                users={usersList}
                handleEditUser={openEditUserModal}
                handleDeleteUser={openDeleteUserModal}
                handleOpenAddEditModal={() => setIsAddEditUserModalOpen(true)}
            />

            <AddEditUserModal
                selectedUser={selectedUser}
                isModalOpen={isAddEditUserModalOpen}
                handleCloseModal={handleCloseModal}
                setIsModalOpen={setIsAddEditUserModalOpen}
                handleGetUsers={() => handleGetUsers(currentPage)}
            />

            <DeleteUserModal
                stateName="users"
                isModalOpen={isDeleteUserModal}
                selectedItemId={selectedUser?.id}
                confirmationMessage="Do you really want to delete this employee?"
                handleCloseModal={handleCloseModal}
                setIsModalOpen={setIsDeleteUserModal}
                handleDeleteItem={(id: string) => doDeleteUser(id)}
                handleGetItems={() => handleGetUsers(currentPage)}
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
                    onChange={onChangePage}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
