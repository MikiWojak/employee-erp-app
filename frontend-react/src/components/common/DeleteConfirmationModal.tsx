import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { RootState } from '@/store';

interface Props {
    isModalOpen: boolean;
    confirmationMessage: string;
    stateName: 'users' | 'contracts' | 'vacations';
    selectedItemId: string | undefined;
    handleGetItems: () => void;
    handleCloseModal: () => void;
    handleDeleteItem: (id: string) => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteConfirmationModal: FC<Props> = ({
    stateName,
    isModalOpen,
    selectedItemId,
    confirmationMessage,
    handleGetItems,
    setIsModalOpen,
    handleCloseModal,
    handleDeleteItem
}) => {
    const { isSuccess } = useSelector((state: RootState) => state[stateName]);

    useEffect(() => {
        if (isModalOpen && isSuccess) {
            close();
            handleGetItems();
        }
    }, [isSuccess]);

    const close = () => {
        setIsModalOpen(false);
        handleCloseModal();
    };

    const handleConfirm = () => {
        if (!selectedItemId) {
            return;
        }

        handleDeleteItem(selectedItemId);
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
                                        Delete Confirmation
                                    </h2>
                                    <button
                                        onClick={() => close()}
                                        className="hover:text-slate-300"
                                    >
                                        <XCircleIcon className="w-8 h-8" />
                                    </button>
                                </div>
                                <div className="p-4">{confirmationMessage}</div>
                                <div className="p-4 flex justify-end gap-3 border-t border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => close()}
                                        className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                                    >
                                        No
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleConfirm()}
                                        className="px-4 py-2 bg-sky-500 rounded-lg text-white hover:bg-sky-600"
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteConfirmationModal;
