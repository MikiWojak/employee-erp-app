import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useSuggestionStore = defineStore('suggestion', {
    actions: {
        async index({ page = 1, perPage = 10, search = '' } = {}) {
            const { data } = await axios.get('/suggestions', {
                params: { page, perPage, q: search }
            });

            return data;
        },

        async show(id) {
            const { data } = await axios.get(`/suggestions/${id}`);

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
        },

        async status({ id, status }) {
            await axios.post(`/suggestions/${id}/status`, { status });
        },

        async getComments({ suggestionId, page = 1, perPage = 10 } = {}) {
            const { data } = await axios.get(
                `/suggestions/${suggestionId}/comments`,
                { params: { page, perPage } }
            );

            return data;
        },

        async storeComment({ suggestionId, content } = {}) {
            console.log('storeComment');

            const { data } = await axios.post(
                `/suggestions/${suggestionId}/comments`,
                { content }
            );

            return data;
        }
    }
});
