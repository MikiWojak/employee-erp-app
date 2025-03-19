import { defineStore } from 'pinia';

import axios from '@/services/axios';
import { Roles } from '@/enums/Roles';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedUser: JSON.parse(localStorage.getItem('loggedUser')) || null
    }),

    getters: {
        loggedIn: state => !!state.loggedUser,
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

        setLoggedUser(loggedUser) {
            this.loggedUser = loggedUser;

            loggedUser
                ? localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
                : localStorage.removeItem('loggedUser');
        }
    }
});
