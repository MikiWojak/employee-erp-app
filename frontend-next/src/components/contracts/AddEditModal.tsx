import dayjs from 'dayjs';
import { Formik } from 'formik';
import DatePicker from 'react-datepicker';
import { FC, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/24/solid';

import {
    store as storeContract,
    update as updateContract
} from '@/store/contract/contractActions';
import { AppDispatch, RootState } from '@/store';
import SelectUser from '@/components/forms/SelectUser';
import DisplayErrors from '@/components/forms/DisplayErrors';
import CustomDateInput from '@/components/refs/CustomDateInput';
import reactSelectThemeColors from '@/helpers/reactSelectThemeColors';
import AddEditContractValidation from '@/validators/AddEditContractValidation';

import type {
    Contract,
    SelectOptionNumber,
    ContractAddEditErrorResponse
} from '@/types';

interface Props {
    isModalOpen: boolean;
    selectedContract: Contract | null;
    handleCloseModal: () => void;
    handleGetContracts: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEditContractModal: FC<Props> = ({
    isModalOpen,
    selectedContract,
    setIsModalOpen,
    handleCloseModal,
    handleGetContracts
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const defaultFormData: Contract = {
        userId: '',
        position: '',
        startDate: '',
        endDate: '',
        vacationDaysPerYear: 20
    };
    const vacationDaysPerYearOptions: SelectOptionNumber[] = [
        { value: 20, label: '20' },
        { value: 26, label: '26' }
    ];

    const [formData, setFormData] = useState<Contract>(defaultFormData);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
        null
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [selectedVacationDaysPerYear, setSelectedVacationDaysPerYear] =
        useState<SingleValue<SelectOptionNumber>>(
            vacationDaysPerYearOptions[0]
        );

    const { errors, isSuccess } = useSelector(
        (state: RootState) => state.contracts
    );
    const serverErrors = errors as ContractAddEditErrorResponse;

    useEffect(() => {
        setSelectedStartDate(
            selectedContract ? new Date(selectedContract.startDate) : null
        );
        setSelectedEndDate(
            selectedContract ? new Date(selectedContract.endDate) : null
        );
        setSelectedVacationDaysPerYear(
            vacationDaysPerYearOptions.find(
                option => option.value === selectedContract?.vacationDaysPerYear
            ) || vacationDaysPerYearOptions[0]
        );
    }, [selectedContract]);

    useEffect(() => {
        if (isModalOpen && isSuccess) {
            close();
            handleGetContracts();
        }
    }, [isSuccess]);

    const close = () => {
        setIsModalOpen(false);
        handleCloseModal();
        setFormData(defaultFormData);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setSelectedVacationDaysPerYear(vacationDaysPerYearOptions[0]);
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

    const onVacationDaysPerYearChange = (
        setFieldValue: (
            field: string,
            value: number,
            shouldValidate?: boolean | undefined
        ) => void,
        option: SingleValue<SelectOptionNumber>
    ) => {
        setSelectedVacationDaysPerYear(option);

        if (option?.value) {
            setFieldValue('vacationDaysPerYear', option.value);
        }
    };

    const saveContract = async (formData: Contract) => {
        selectedContract
            ? dispatch(updateContract(formData))
            : dispatch(storeContract(formData));
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
                                        {selectedContract
                                            ? 'Edit contract'
                                            : 'Add contract'}
                                    </h2>
                                    <button
                                        onClick={() => close()}
                                        className="hover:text-slate-300"
                                    >
                                        <XCircleIcon className="w-8 h-8" />
                                    </button>
                                </div>

                                <Formik
                                    initialValues={selectedContract || formData}
                                    validationSchema={AddEditContractValidation}
                                    onSubmit={formData =>
                                        saveContract(formData)
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

                                                <DisplayErrors
                                                    error={serverErrors?.userId}
                                                    name="userId"
                                                />

                                                <div className="mt-4">
                                                    <label htmlFor="position">
                                                        Position
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="position"
                                                        id="position"
                                                        className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded focus:outline-none focus:border-sky-500"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.position}
                                                    />
                                                </div>

                                                <DisplayErrors
                                                    error={
                                                        serverErrors?.position
                                                    }
                                                    name="position"
                                                />

                                                <div className="mt-4">
                                                    <label htmlFor="startDate">
                                                        Start date
                                                    </label>

                                                    <DatePicker
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        showPopperArrow={false}
                                                        selected={
                                                            selectedStartDate
                                                        }
                                                        dateFormat="dd.MM.yyyy"
                                                        dropdownMode="select"
                                                        maxDate={
                                                            selectedEndDate
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

                                                <div className="mt-4">
                                                    <label htmlFor="endDate">
                                                        End date
                                                    </label>

                                                    <DatePicker
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        showPopperArrow={false}
                                                        selected={
                                                            selectedEndDate
                                                        }
                                                        dateFormat="dd.MM.yyyy"
                                                        dropdownMode="select"
                                                        minDate={
                                                            selectedStartDate
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

                                                <div className="mt-4">
                                                    <label htmlFor="vacationDaysPerYear">
                                                        Days off/year
                                                    </label>
                                                    <Select
                                                        options={
                                                            vacationDaysPerYearOptions
                                                        }
                                                        value={
                                                            selectedVacationDaysPerYear
                                                        }
                                                        classNames={{
                                                            input: () =>
                                                                '!py-1.5',
                                                            indicatorSeparator:
                                                                () => 'hidden',
                                                            control: state =>
                                                                !state.isFocused
                                                                    ? '!border-slate-700'
                                                                    : '',
                                                            option: () =>
                                                                '!text-white'
                                                        }}
                                                        theme={theme => ({
                                                            ...theme,
                                                            borderRadius: 4,
                                                            colors: {
                                                                ...theme.colors,
                                                                ...reactSelectThemeColors
                                                            }
                                                        })}
                                                        onChange={option =>
                                                            onVacationDaysPerYearChange(
                                                                setFieldValue,
                                                                option
                                                            )
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                </div>

                                                <DisplayErrors
                                                    error={
                                                        serverErrors?.vacationDaysPerYear
                                                    }
                                                    name="vacationDaysPerYear"
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

export default AddEditContractModal;
