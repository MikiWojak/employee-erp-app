import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedUser: null
    }),

    getters: {
        loggedIn: state => !!state.loggedUser,
        isAdmin: state => state.loggedUser?.role?.name === 'admin',
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
        }
    }
});
