export const state = () => ({
    items: []
});

export const getters = {
    items: state => state.items
};

export const mutations = {
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

export const actions = {
    async index({ commit }) {
        const {
            data: { rows }
        } = await this.$axios.get('/contracts', {
            params: {
                fetchAll: true
            }
        });

        commit('SET_CONTRACTS', rows);
    },

    async store({ commit }, data) {
        const { data: contract } = await this.$axios.post('/contracts', data);

        commit('STORE_CONTRACT', contract);
    },

    async update({ commit }, data) {
        const { data: contract } = await this.$axios.put(
            `/contracts/${data.id}`,
            data
        );

        commit('UPDATE_CONTRACT', contract);
    },

    async destroy({ commit }, id) {
        await this.$axios.delete(`/contracts/${id}`);

        commit('DESTROY_CONTRACT', id);
    },

    clear({ commit }) {
        commit('SET_CONTRACTS', []);
    }
};
