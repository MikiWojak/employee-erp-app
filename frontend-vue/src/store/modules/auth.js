import axios from 'axios';

const state = () => ({
    loggedUser: JSON.parse(localStorage.getItem('loggedUser')) || null
});

const getters = {
    loggedIn: state => !!state.loggedUser,

    loggedUser: state => state.loggedUser,

    isAdmin: state => state.loggedUser?.role?.name === 'admin',

    vacationDaysLeft: state =>
        state.loggedUser?.vacationDaysSum -
            state.loggedUser?.vacationDaysUsed || 0
};

const mutations = {
    LOGIN(state, response) {
        state.loggedUser = response;
    },

    LOGOUT(state) {
        state.loggedUser = null;
    }
};

const actions = {
    async login({ commit }, { email, password }) {
        const { data: loggedUser } = await axios.post('/auth/login', {
            email,
            password
        });

        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        commit('LOGIN', loggedUser);
    },

    async logout({ getters, commit }) {
        if (!getters.loggedIn) {
            return;
        }

        await axios.post('/auth/logout');

        localStorage.removeItem('loggedUser');
        commit('LOGOUT');
    },

    async me({ commit }) {
        const { data: loggedUser } = await axios.get('/auth/me');

        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        commit('LOGIN', loggedUser);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
