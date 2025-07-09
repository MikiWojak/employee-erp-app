import { defineStore } from 'pinia';

import axios from '@/services/axios';
import { Roles } from '@/enums/Roles';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedUser: JSON.parse(localStorage.getItem('loggedUser')) || null,
        vacationSummary:
            JSON.parse(localStorage.getItem('vacationSummary')) || null
    }),

    getters: {
        loggedIn: state => !!state.loggedUser,
        roleName: state => state.loggedUser?.role?.name,
        isAdmin: state => state.roleName === Roles.ADMIN,
        isManager: state => state.roleName === Roles.MANAGER,
        isEmployee: state => state.roleName === Roles.EMPLOYEE,
        vacationDaysLeft: state =>
            state.loggedUser?.vacationDaysSum -
                state.loggedUser?.vacationDaysUsed || 0
    },

    actions: {
        async login({ email, password }) {
            const { data } = await axios.post('/auth/login', {
                email,
                password
            });

            this.setLoggedUser(data);
        },

        async logout() {
            await axios.post('/auth/logout');

            this.setLoggedUser(null);
        },

        async me() {
            try {
                const { data } = await axios.get('/auth/me');

                this.setLoggedUser(data);
            } catch {
                this.setLoggedUser(null);
            }
        },

        async checkSetPasswordToken({ token }) {
            await axios.post('/auth/check-set-password-token', {
                token
            });
        },

        async setPassword({ token, password, passwordConfirmation }) {
            await axios.post('/auth/set-password', {
                token,
                password,
                passwordConfirmation
            });
        },

        async sendResetPasswordLink({ email }) {
            await axios.post('/auth/send-reset-password-link', { email });
        },

        async updateProfile(multipartFormData) {
            const { data } = await axios.put(
                '/auth/profile',
                multipartFormData,
                {
                    headers: {
                        contentType: 'multipart/form-data'
                    }
                }
            );

            this.setLoggedUser(data);
        },

        setLoggedUser(data) {
            this.loggedUser = data?.user || null;
            this.vacationSummary = data?.vacationSummary || null;

            if (data) {
                localStorage.setItem('loggedUser', JSON.stringify(data.user));
                localStorage.setItem(
                    'vacationSummary',
                    JSON.stringify(data.vacationSummary)
                );
            } else {
                localStorage.removeItem('loggedUser');
                localStorage.removeItem('vacationSummary');
            }
        }
    }
});
