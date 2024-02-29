import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/store';
import { index as getUsers } from '@/store/user/userActions';
import reactSelectThemeColors from '@/helpers/reactSelectThemeColors';

import type { User, UserIndexResponse, SelectOptionString } from '@/types';

interface Props {
    choosenUser?: User;
    handleUserSelect: (userId: string | undefined) => void;
}

const SelectUser: FC<Props> = ({ choosenUser, handleUserSelect }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [selectedUser, setSelectedUser] = useState<
        SingleValue<SelectOptionString> | undefined
    >();
    const [defaultUsers, setDefaultUsers] = useState<SelectOptionString[]>([]);

    const { isAdmin } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAdmin) {
            getDefaultUsers();
        }

        if (choosenUser) {
            setSelectedUser(getUserOption(choosenUser));
        }
    }, []);

    const userSelect = (user: SingleValue<SelectOptionString>) => {
        setSelectedUser(user);

        handleUserSelect(user?.value);
    };

    const searchUsers = async (search: string) => {
        const action = await dispatch(getUsers({ search }));
        const response = action.payload as UserIndexResponse;

        return response ? mapUserOptions(response.data.rows) : [];
    };

    const getDefaultUsers = async () => {
        const action = await dispatch(getUsers({}));
        const response = action.payload as UserIndexResponse;

        if (response) {
            setDefaultUsers(mapUserOptions(response.data.rows));
        }
    };

    const getUserOption = (user: User): SelectOptionString => ({
        value: user.id || '',
        label: `${user.firstName} ${user.lastName}`
    });

    const mapUserOptions = (users: User[]): SelectOptionString[] =>
        users.map(user => getUserOption(user));

    return (
        <AsyncSelect
            defaultOptions={defaultUsers}
            loadOptions={searchUsers}
            value={selectedUser}
            classNames={{
                input: () => '!py-1.5',
                indicatorSeparator: () => 'hidden',
                control: state => (!state.isFocused ? '!border-slate-700' : ''),
                option: () => '!text-white'
            }}
            theme={theme => ({
                ...theme,
                borderRadius: 4,
                colors: {
                    ...theme.colors,
                    ...reactSelectThemeColors
                }
            })}
            onChange={user => userSelect(user)}
        />
    );
};

export default SelectUser;
