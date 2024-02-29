import type { User } from '@/types/api/user';

type LoggedUser = User | null;

type LoginRequest = {
    email: string;
    password: string;
};

type LoginErrorResponse = {
    email?: string;
    password?: string;
};

export type { LoggedUser, LoginRequest, LoginErrorResponse };
