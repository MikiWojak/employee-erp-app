import axios from 'axios';

const state = () => ({
    items: []
});

const getters = {
    items: state => state.items
};

const mutations = {
    SET_CONTRACTS(state, items) {
        state.items = items;
    },

    STORE_CONTRACT(state, item) {
        state.items.push(item);
    },

    UPDATE_CONTRACT(state, contract) {
        const index = state.items.findIndex(item => item.id === contract.id);

        if (~index) {
            state.items.splice(index, 1, contract);
        }
    },

    DESTROY_CONTRACT(state, id) {
        const index = state.items.findIndex(item => item.id === id);

        if (~index) {
            state.items.splice(index, 1);
        }
    }
};

const actions = {
    async index({ commit }) {
        const {
            data: { rows: contracts }
        } = await axios.get('/contracts', {
            params: {
                fetchAll: true
            }
        });

        commit('SET_CONTRACTS', contracts);
    },

    async store({ commit }, data) {
        const { data: contract } = await axios.post('/contracts', data);

        commit('STORE_CONTRACT', contract);
    },

    async update({ commit }, data) {
        const { data: contract } = await axios.put(
            `/contracts/${data.id}`,
            data
        );

        commit('UPDATE_CONTRACT', contract);
    },

    async destroy({ commit }, id) {
        await axios.delete(`/contracts/${id}`);

        commit('DESTROY_CONTRACT', id);
    },

    clear({ commit }) {
        commit('SET_CONTRACTS', []);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
