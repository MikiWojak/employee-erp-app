import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useDepartmentStore = defineStore('department', {
    actions: {
        async index({ page = 1, perPage = 10, search = '' } = {}) {
            const { data } = await axios.get('/departments', {
                params: { page, perPage, q: search }
            });

            return data;
        },

        async store(body) {
            const { data } = await axios.post('/departments', body);

            return data;
        },

        async update(body) {
            const { data } = await axios.put(`/departments/${body.id}`, body);

            return data;
        },

        async destroy(id) {
            await axios.delete(`/departments/${id}`);
        }
    }
});
