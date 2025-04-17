import { defineStore } from 'pinia';

import axios from '@/services/axios';
import { Roles } from '@/enums/Roles';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedUser: JSON.parse(localStorage.getItem('loggedUser')) || null
    }),

    getters: {
        loggedIn: state => !!state.loggedUser,
        rolesInfo: state => state.loggedUser.roles.map(role => role.name),
        isAdmin: state =>
            state.loggedUser?.roles?.some(role => role.name === Roles.ADMIN),
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
                multipartFormData
            );

            this.setLoggedUser(data);
        },

        setLoggedUser(loggedUser) {
            this.loggedUser = loggedUser;

            loggedUser
                ? localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
                : localStorage.removeItem('loggedUser');
        }
    }
});
