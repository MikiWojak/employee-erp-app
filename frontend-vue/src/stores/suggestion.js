import { defineStore } from 'pinia';

import axios from '@/services/axios';
import { id } from 'vuetify/locale';

export const useSuggestionStore = defineStore('suggestion', {
    actions: {
        async index({ page = 1, perPage = 10, search = '' } = {}) {
            const { data } = await axios.get('/suggestions', {
                params: { page, perPage, q: search }
            });

            return data;
        },

        async store(body) {
            const { data } = await axios.post('/suggestions', body);

            return data;
        },

        async update(body) {
            const { data } = await axios.put(`/suggestions/${body.id}`, body);

            return data;
        },

        async destroy(id) {
            await axios.delete(`/suggestions/${id}`);
        },

        async vote({ id, vote }) {
            await axios.post(`/suggestions/${id}/vote`, { vote });
        }
    }
});
