import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useVacationStore = defineStore('vacation', {
    actions: {
        async index() {
            const { data } = await axios.get('/vacations', {
                params: {
                    fetchAll: true
                }
            });

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
