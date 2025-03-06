import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useContractStore = defineStore('contract', {
    actions: {
        async index({ page = 1, perPage = 10, search = '' } = {}) {
            const { data } = await axios.get('/contracts', {
                params: { page, perPage, q: search }
            });

            return data;
        },

        async store(body) {
            const { data } = await axios.post('/contracts', body);

            return data;
        },

        async update(body) {
            const { data } = await axios.put(`/contracts/${body.id}`, body);

            return data;
        },

        async destroy(id) {
            await axios.delete(`/contracts/${id}`);
        }
    }
});
