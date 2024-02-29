import type { User } from '@/types/api/user';

type Vacation = {
    id?: string;
    userId: string;
    startDate: string;
    endDate: string;
    duration?: number;
    approved: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    user?: User;
};

type VacationAddEditErrorResponse = {
    userId?: string;
    startDate?: string;
    endDate?: string;
    approved?: string;
};

export type { Vacation, VacationAddEditErrorResponse };
