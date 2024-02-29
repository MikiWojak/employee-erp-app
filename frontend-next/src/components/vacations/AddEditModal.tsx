import dayjs from 'dayjs';
import { Formik } from 'formik';
import DatePicker from 'react-datepicker';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/24/solid';

import {
    store as storeVacation,
    update as updateVacation
} from '@/store/vacation/vacationActions';
import { AppDispatch, RootState } from '@/store';
import SelectUser from '@/components/forms/SelectUser';
import DisplayErrors from '@/components/forms/DisplayErrors';
import CustomDateInput from '@/components/refs/CustomDateInput';
import AddEditVacationValidation from '@/validators/AddEditVacationValidation';

import type { Vacation, VacationAddEditErrorResponse } from '@/types';

interface Props {
    isModalOpen: boolean;
    selectedVacation: Vacation | null;
    handleCloseModal: () => void;
    handleGetVacations: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEditVacationModal: FC<Props> = ({
    isModalOpen,
    selectedVacation,
    setIsModalOpen,
    handleCloseModal,
    handleGetVacations
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const { isAdmin, loggedUser } = useSelector(
        (state: RootState) => state.auth
    );

    const defaultFormData: Vacation = {
        userId: !isAdmin ? loggedUser?.id || '' : '',
        startDate: '',
        endDate: '',
        approved: false
    };

    const [formData, setFormData] = useState<Vacation>(defaultFormData);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
        null
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const { errors, isSuccess } = useSelector(
        (state: RootState) => state.vacations
    );
    const serverErrors = errors as VacationAddEditErrorResponse;

    useEffect(() => {
        setSelectedStartDate(
            selectedVacation ? new Date(selectedVacation.startDate) : null
        );
        setSelectedEndDate(
            selectedVacation ? new Date(selectedVacation.endDate) : null
        );
    }, [selectedVacation]);

    useEffect(() => {
        if (isModalOpen && isSuccess) {
            close();
            handleGetVacations();
        }
    }, [isSuccess]);

    const isWeekday = (date: Date) => {
        const day = date.getDay();

        return day !== 0 && day !== 6;
    };

    const close = () => {
        setIsModalOpen(false);
        handleCloseModal();
        setFormData(defaultFormData);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
    };

    const onDateChange = (
        setDate: React.Dispatch<React.SetStateAction<Date | null>>,
        setFieldValue: (
            field: string,
            value: string,
            shouldValidate?: boolean | undefined
        ) => void,
        name: string,
        date: Date | null
    ) => {
        setDate(date);
        setFieldValue(name, dayjs(date).format('YYYY-MM-DD'));
    };

    const saveVacation = async (formData: Vacation) => {
        selectedVacation
            ? dispatch(updateVacation(formData))
            : dispatch(storeVacation(formData));
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
                                        {selectedVacation
                                            ? 'Edit vacation'
                                            : 'Add vacation'}
                                    </h2>
                                    <button
                                        onClick={() => close()}
                                        className="hover:text-slate-300"
                                    >
                                        <XCircleIcon className="w-8 h-8" />
                                    </button>
                                </div>

                                <Formik
                                    initialValues={selectedVacation || formData}
                                    validationSchema={AddEditVacationValidation(
                                        isAdmin
                                    )}
                                    onSubmit={formData =>
                                        saveVacation(formData)
                                    }
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
                                                {isAdmin && (
                                                    <div>
                                                        <label htmlFor="userId">
                                                            User
                                                        </label>
                                                        <SelectUser
                                                            choosenUser={
                                                                values.user
                                                            }
                                                            handleUserSelect={userId =>
                                                                setFieldValue(
                                                                    'userId',
                                                                    userId
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                <DisplayErrors
                                                    error={serverErrors?.userId}
                                                    name="userId"
                                                />

                                                <div
                                                    className={`${
                                                        isAdmin ? 'mt-4 ' : ''
                                                    } flex gap-4`}
                                                >
                                                    <div className="w-1/2">
                                                        <label htmlFor="startDate">
                                                            Start date
                                                        </label>

                                                        <DatePicker
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            showPopperArrow={
                                                                false
                                                            }
                                                            selected={
                                                                selectedStartDate
                                                            }
                                                            dateFormat="dd.MM.yyyy"
                                                            dropdownMode="select"
                                                            maxDate={
                                                                selectedEndDate
                                                            }
                                                            filterDate={
                                                                isWeekday
                                                            }
                                                            className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded text-white focus:outline-none focus:border-sky-500"
                                                            onChange={date =>
                                                                onDateChange(
                                                                    setSelectedStartDate,
                                                                    setFieldValue,
                                                                    'startDate',
                                                                    date
                                                                )
                                                            }
                                                            customInput={
                                                                <CustomDateInput inputId="startDate" />
                                                            }
                                                        />

                                                        <DisplayErrors
                                                            error={
                                                                serverErrors?.startDate
                                                            }
                                                            name="startDate"
                                                        />
                                                    </div>
                                                    <div className="w-1/2">
                                                        <label htmlFor="endDate">
                                                            End date
                                                        </label>

                                                        <DatePicker
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            showPopperArrow={
                                                                false
                                                            }
                                                            selected={
                                                                selectedEndDate
                                                            }
                                                            dateFormat="dd.MM.yyyy"
                                                            dropdownMode="select"
                                                            minDate={
                                                                selectedStartDate
                                                            }
                                                            filterDate={
                                                                isWeekday
                                                            }
                                                            className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded text-white focus:outline-none focus:border-sky-500"
                                                            onChange={date =>
                                                                onDateChange(
                                                                    setSelectedEndDate,
                                                                    setFieldValue,
                                                                    'endDate',
                                                                    date
                                                                )
                                                            }
                                                            customInput={
                                                                <CustomDateInput inputId="endDate" />
                                                            }
                                                        />

                                                        <DisplayErrors
                                                            error={
                                                                serverErrors?.endDate
                                                            }
                                                            name="endDate"
                                                        />
                                                    </div>
                                                </div>

                                                {isAdmin && (
                                                    <div className="mt-4">
                                                        <label className="relative flex justify-between items-center group">
                                                            Approved
                                                            <input
                                                                type="checkbox"
                                                                name="approved"
                                                                id="approved"
                                                                className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                checked={
                                                                    values.approved
                                                                }
                                                            />
                                                            <span className="w-8 h-5 flex items-center flex-shrink-0 p-0.5 bg-slate-600 rounded-full duration-300 ease-in-out peer-checked:bg-sky-500 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3 group-hover:after:translate-x-0.5"></span>
                                                        </label>
                                                    </div>
                                                )}

                                                <DisplayErrors
                                                    error={
                                                        serverErrors?.approved
                                                    }
                                                    name="approved"
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

export default AddEditVacationModal;
