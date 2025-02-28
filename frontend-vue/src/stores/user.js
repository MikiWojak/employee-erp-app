import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useUserStore = defineStore('user', {
    actions: {
        async index() {
            const { data } = await axios.get('/users', {
                params: {
                    fetchAll: true
                }
            });

            return data;
        },

        async store(body) {
            const { data } = await axios.post('/users', body);

            return data;
        },

        async update(body) {
            const { data } = await axios.put(`/users/${body.id}`, body);

            return data;
        },

        async destroy(id) {
            await axios.delete(`/users/${id}`);
        }
    }
});
