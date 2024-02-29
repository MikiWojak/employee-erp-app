type User = {
    id?: string;
    roleId?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    password?: string;
    vacationDaysSum?: number;
    vacationDaysUsed?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    role?: Role;
};

type Role = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

type UserAddEditErrorResponse = {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    email?: string;
    password?: string;
};

type UserIndexResponseData = {
    rows: User[];
    count: number;
};

type UserIndexResponse = {
    data: UserIndexResponseData;
    page: number;
};

export type {
    User,
    Role,
    UserIndexResponse,
    UserIndexResponseData,
    UserAddEditErrorResponse
};
