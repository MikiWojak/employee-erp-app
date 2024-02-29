import { FC } from 'react';
import {
    HomeIcon,
    BriefcaseIcon,
    UserCircleIcon,
    BellSnoozeIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/store';
import { logout } from '@/store/auth/authActions';
import { clear as clearUsers } from '@/store/user/userSlice';
import { clear as clearContracts } from '@/store/contract/contractSlice';
import { clear as clearVacations } from '@/store/vacation/vacationSlice';

const Sidebar: FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { loggedUser } = useSelector((state: RootState) => state.auth);

    const fullName = `${loggedUser?.firstName} ${loggedUser?.lastName}`;

    const doLogout = () => {
        dispatch(logout());
        dispatch(clearUsers());
        dispatch(clearContracts());
        dispatch(clearVacations());
    };

    return (
        <nav className="w-60 bg-sky-500 text-center">
            <ul>
                <li>
                    <div className="px-4 py-3">
                        <UserCircleIcon className="mx-auto w-12 h-12" />
                        <h6 className="text-xl font-bold">{fullName}</h6>
                        <span>{loggedUser?.role?.name}</span>
                    </div>
                </li>

                <li>
                    <hr />
                </li>

                <li>
                    <Link
                        to="/"
                        className="flex px-4 py-3 text-center cursor-pointer hover:bg-sky-600"
                    >
                        <HomeIcon className="w-6 h-6 mr-2" />
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li>
                    <Link
                        to="/contracts"
                        className="flex px-4 py-3 text-center cursor-pointer hover:bg-sky-600"
                    >
                        <BriefcaseIcon className="w-6 h-6 mr-2" />
                        <span>Contracts</span>
                    </Link>
                </li>

                <li>
                    <Link
                        to="/vacations"
                        className="flex px-4 py-3 text-center cursor-pointer hover:bg-sky-600"
                    >
                        <BellSnoozeIcon className="w-6 h-6 mr-2" />
                        <span>Vacations</span>
                    </Link>
                </li>

                <li>
                    <hr />
                </li>

                <li>
                    <button
                        className="flex w-full px-4 py-3 text-center cursor-pointer hover:bg-sky-600"
                        onClick={() => doLogout()}
                    >
                        <ArrowRightOnRectangleIcon className="w-6 h-6 mr-2" />
                        <span>Logout</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
