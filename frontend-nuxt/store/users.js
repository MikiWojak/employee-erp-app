export const state = () => ({
    items: []
});

export const getters = {
    items: state => state.items
};

export const mutations = {
    SET_USERS(state, items) {
        state.items = items;
    },

    STORE_USER(state, item) {
        state.items.push(item);
    },

    UPDATE_USER(state, user) {
        const index = state.items.findIndex(item => item.id === user.id);

        if (~index) {
            state.items.splice(index, 1, user);
        }
    },

    DESTROY_USER(state, id) {
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
        } = await this.$axios.get('/users', {
            params: {
                fetchAll: true
            }
        });

        commit('SET_USERS', rows);
    },

    async store({ commit }, data) {
        const { data: user } = await this.$axios.post('/users', data);

        commit('STORE_USER', user);
    },

    async update({ commit }, data) {
        const { data: user } = await this.$axios.put(`/users/${data.id}`, data);

        commit('UPDATE_USER', user);
    },

    async destroy({ commit }, id) {
        await this.$axios.delete(`/users/${id}`);

        commit('DESTROY_USER', id);
    },

    clear({ commit }) {
        commit('SET_USERS', []);
    }
};
