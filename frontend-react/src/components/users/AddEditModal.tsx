import dayjs from 'dayjs';
import { Formik } from 'formik';
import DatePicker from 'react-datepicker';
import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/24/solid';

import {
    store as storeUser,
    update as updateUser
} from '@/store/user/userActions';
import { AppDispatch, RootState } from '@/store';
import DisplayErrors from '@/components/DisplayErrors';
import CustomDateInput from '@/components/refs/CustomDateInput';
import AddEditUserValidation from '@/validators/AddEditUserValidation';

import type { User, UserAddEditErrorResponse } from '@/types';

interface Props {
    isModalOpen: boolean;
    selectedUser: User | null;
    handleGetUsers: () => void;
    handleCloseModal: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEditUserModal: FC<Props> = ({
    isModalOpen,
    selectedUser,
    setIsModalOpen,
    handleGetUsers,
    handleCloseModal
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const defaultFormData: User = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        password: ''
    };

    const [formData, setFormData] = useState<User>(defaultFormData);
    const [selectedDateOfBirth, setSelectedDateOfBirth] = useState<Date | null>(
        null
    );

    const { errors, isSuccess } = useSelector(
        (state: RootState) => state.users
    );
    const serverErrors = errors as UserAddEditErrorResponse;

    useEffect(() => {
        setSelectedDateOfBirth(
            selectedUser ? new Date(selectedUser.dateOfBirth) : null
        );
    }, [selectedUser]);

    useEffect(() => {
        if (isModalOpen && isSuccess) {
            close();
            handleGetUsers();
        }
    }, [isSuccess]);

    const maxDateOfBirth = new Date();

    const close = () => {
        setIsModalOpen(false);
        handleCloseModal();
        setFormData(defaultFormData);
        setSelectedDateOfBirth(null);
    };

    const onDateOfBirthChange = (
        setFieldValue: (
            field: string,
            value: string,
            shouldValidate?: boolean | undefined
        ) => void,
        name: string,
        date: Date | null
    ) => {
        setSelectedDateOfBirth(date);
        setFieldValue(name, dayjs(date).format('YYYY-MM-DD'));
    };

    const saveUser = async (formData: User) => {
        selectedUser
            ? dispatch(updateUser(formData))
            : dispatch(storeUser(formData));
    };

    return (
        <div>
            {isModalOpen && (
                <div>
                    <div className="flex justify-center md:items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <div className="relative my-6 mx-auto w-96 max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-slate-800 bg-slate-800 outline-none focus:outline-none">
                                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                                    <h2 className="text-2xl font-bold">
                                        {selectedUser
                                            ? 'Edit employee'
                                            : 'Add employee'}
                                    </h2>
                                    <button
                                        onClick={() => close()}
                                        className="hover:text-slate-300"
                                    >
                                        <XCircleIcon className="w-8 h-8" />
                                    </button>
                                </div>

                                <Formik
                                    initialValues={selectedUser || formData}
                                    validationSchema={AddEditUserValidation(
                                        selectedUser
                                    )}
                                    onSubmit={formData => saveUser(formData)}
                                >
                                    {({
                                        values,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        setFieldValue
                                    }) => (
                                        <form onSubmit={handleSubmit}>
                                            <div className="p-4">
                                                <div>
                                                    <label htmlFor="firstName">
                                                        First name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        id="firstName"
                                                        className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded focus:outline-none focus:border-sky-500"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.firstName}
                                                    />
                                                </div>

                                                <DisplayErrors
                                                    error={
                                                        serverErrors?.firstName
                                                    }
                                                    name="firstName"
                                                />

                                                <div className="mt-4">
                                                    <label htmlFor="lastName">
                                                        Last name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        id="lastName"
                                                        className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded focus:outline-none focus:border-sky-500"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.lastName}
                                                    />
                                                </div>

                                                <DisplayErrors
                                                    error={
                                                        serverErrors?.lastName
                                                    }
                                                    name="lastName"
                                                />

                                                <div className="mt-4">
                                                    <label htmlFor="dateOfBirth">
                                                        Date of birth
                                                    </label>

                                                    <DatePicker
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        showPopperArrow={false}
                                                        selected={
                                                            selectedDateOfBirth
                                                        }
                                                        dateFormat="yyyy-MM-dd"
                                                        dropdownMode="select"
                                                        maxDate={maxDateOfBirth}
                                                        className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded text-white focus:outline-none focus:border-sky-500"
                                                        onChange={date =>
                                                            onDateOfBirthChange(
                                                                setFieldValue,
                                                                'dateOfBirth',
                                                                date
                                                            )
                                                        }
                                                        customInput={
                                                            <CustomDateInput inputId="dateOfBirth" />
                                                        }
                                                    />
                                                    <DisplayErrors
                                                        error={
                                                            serverErrors?.dateOfBirth
                                                        }
                                                        name="dateOfBirth"
                                                    />
                                                </div>

                                                <div className="mt-4">
                                                    <label htmlFor="email">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded focus:outline-none focus:border-sky-500"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.email}
                                                    />
                                                </div>

                                                <DisplayErrors
                                                    error={serverErrors?.email}
                                                    name="email"
                                                />

                                                {!selectedUser && (
                                                    <div className="mt-4">
                                                        <label htmlFor="password">
                                                            Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded focus:outline-none focus:border-sky-500"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            value={
                                                                values.password
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                <DisplayErrors
                                                    error={
                                                        serverErrors?.password
                                                    }
                                                    name="password"
                                                />
                                            </div>
                                            <div className="p-4 flex justify-end gap-3 border-t border-slate-700">
                                                <button
                                                    type="button"
                                                    onClick={() => close()}
                                                    className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-sky-500 rounded-lg text-white hover:bg-sky-600"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddEditUserModal;
