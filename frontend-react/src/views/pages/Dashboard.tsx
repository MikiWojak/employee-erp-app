import Pagination from 'react-js-pagination';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    index as getUsers,
    destroy as deleteUser
} from '@/store/user/userActions';
import { me } from '@/store/auth/authActions';
import { AppDispatch, RootState } from '@/store';
import LoggedLayout from '@/views/layouts/LoggedLayout';
import AdminDashboard from '@/components/dashboard/Admin';
import { clearOnCloseModal } from '@/store/user/userSlice';
import AddEditUserModal from '@/components/users/AddEditModal';
import EmployeeDashboard from '@/components/dashboard/Employee';
import DeleteUserModal from '@/components/common/DeleteConfirmationModal';

import type { User } from '@/types';

const Dashboard: FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isAddEditUserModalOpen, setIsAddEditUserModalOpen] =
        useState<boolean>(false);
    const [isDeleteUserModal, setIsDeleteUserModal] = useState<boolean>(false);

    const { isAdmin, loggedUser } = useSelector(
        (state: RootState) => state.auth
    );
    const {
        items: users,
        perPage,
        count
    } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        if (isAdmin) {
            doGetUsers(currentPage);
        }

        getLoggedUser();
    }, []);

    const doGetUsers = async (page: number) => {
        dispatch(getUsers({ page }));
        setCurrentPage(page);
    };

    const getLoggedUser = async () => {
        dispatch(me());
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
        <LoggedLayout>
            {isAdmin ? (
                <div>
                    <AdminDashboard
                        users={users}
                        handleOpenAddEditModal={() =>
                            setIsAddEditUserModalOpen(true)
                        }
                        handleEditUser={openEditUserModal}
                        handleDeleteUser={openDeleteUserModal}
                    />

                    <AddEditUserModal
                        selectedUser={selectedUser}
                        isModalOpen={isAddEditUserModalOpen}
                        handleCloseModal={handleCloseModal}
                        setIsModalOpen={setIsAddEditUserModalOpen}
                        handleGetUsers={() => doGetUsers(currentPage)}
                    />

                    <DeleteUserModal
                        stateName="users"
                        isModalOpen={isDeleteUserModal}
                        selectedItemId={selectedUser?.id}
                        confirmationMessage="Do you really want to delete this employee?"
                        handleCloseModal={handleCloseModal}
                        setIsModalOpen={setIsDeleteUserModal}
                        handleDeleteItem={(id: string) => doDeleteUser(id)}
                        handleGetItems={() => doGetUsers(currentPage)}
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
                            onChange={doGetUsers}
                        />
                    </div>
                </div>
            ) : (
                <EmployeeDashboard loggedUser={loggedUser} />
            )}
        </LoggedLayout>
    );
};

export default Dashboard;
