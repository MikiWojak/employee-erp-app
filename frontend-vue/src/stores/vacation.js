import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useVacationStore = defineStore('vacation', {
    actions: {
        async index({
            page = 1,
            perPage = 10,
            search = '',
            mineOnly = false
        } = {}) {
            const params = { page, perPage, q: search };

            if (mineOnly) {
                params.mineOnly = true;
            }

            const { data } = await axios.get('/vacations', { params });

            return data;
        },

        async store(body) {
            const { data } = await axios.post('/vacations', body);

            return data;
        },

        async update(body) {
            const { data } = await axios.put(`/vacations/${body.id}`, body);

            return data;
        },

        async destroy(id) {
            await axios.delete(`/vacations/${id}`);
        }
    }
});
