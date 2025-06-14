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

        async store(body) {
            const { data } = await axios.post('/suggestions', body);

            return data;
        }
    }
});
