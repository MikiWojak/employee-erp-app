import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedUser: JSON.parse(localStorage.getItem('loggedUser')) || null
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
            const { data: loggedUser } = await axios.post('/auth/login', {
                email,
                password
            });

            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

            this.setLoggedUser(loggedUser);
        },

        async logout() {
            // @TODO Check if necessary
            if (!this.loggedIn) {
                return;
            }

            await axios.post('/auth/logout');

            localStorage.removeItem('loggedUser');

            this.setLoggedUser(null);
        },

        async me() {
            const { data: loggedUser } = await axios.get('/auth/me');

            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

            this.setLoggedUser(loggedUser);
        },

        setLoggedUser(loggedUser) {
            this.loggedUser = loggedUser;
        }
    }
});
