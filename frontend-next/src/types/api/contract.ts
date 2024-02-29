import type { User } from '@/types/api/user';

type Contract = {
    id?: string;
    userId: string;
    position: string;
    startDate: string;
    endDate: string;
    vacationDaysPerYear: number;
    vacationDays?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    user?: User;
};

type ContractAddEditErrorResponse = {
    userId?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    vacationDaysPerYear?: string;
};

export type { Contract, ContractAddEditErrorResponse };
