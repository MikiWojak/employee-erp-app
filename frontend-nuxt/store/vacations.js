export const state = () => ({
    items: []
});

export const getters = {
    items: state => state.items
};

export const mutations = {
    SET_VACATIONS(state, items) {
        state.items = items;
    },

    STORE_VACATION(state, item) {
        state.items.push(item);
    },

    UPDATE_VACATION(state, vacation) {
        const index = state.items.findIndex(item => item.id === vacation.id);

        if (~index) {
            state.items.splice(index, 1, vacation);
        }
    },

    DESTROY_VACATION(state, id) {
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
        } = await this.$axios.get('/vacations', {
            params: {
                fetchAll: true
            }
        });

        commit('SET_VACATIONS', rows);
    },

    async store({ commit }, data) {
        const { data: vacation } = await this.$axios.post('/vacations', data);

        commit('STORE_VACATION', vacation);
    },

    async update({ commit }, data) {
        const { data: vacation } = await this.$axios.put(
            `/vacations/${data.id}`,
            data
        );

        commit('UPDATE_VACATION', vacation);
    },

    async destroy({ commit }, id) {
        await this.$axios.delete(`/vacations/${id}`);

        commit('DESTROY_VACATION', id);
    },

    clear({ commit }) {
        commit('SET_VACATIONS', []);
    }
};
