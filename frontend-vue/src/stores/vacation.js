import { defineStore } from 'pinia';

import axios from '@/services/api';

export const useVacationStore = defineStore('vacation', {
    state: () => ({
        items: []
    }),

    actions: {
        async index() {
            const {
                data: { rows: items }
            } = await axios.get('/vacations', {
                params: {
                    fetchAll: true
                }
            });

            this.setItems(items);
        },

        async store(data) {
            const { data: item } = await axios.post('/vacations', data);

            this.storeItem(item);
        },

        async update(data) {
            const { data: item } = await axios.put(
                `/vacations/${data.id}`,
                data
            );

            this.updateItem(item);
        },

        async destroy(id) {
            await axios.delete(`/vacations/${id}`);

            this.destroyItem(id);
        },

        setItems(items) {
            this.items = items;
        },

        storeItem(item) {
            this.items.push(item);
        },

        updateItem(item) {
            const index = this.items.findIndex(
                singleItem => singleItem.id === item.id
            );

            if (~index) {
                this.items.splice(index, 1, item);
            }
        },

        destroyItem(id) {
            const index = this.items.findIndex(
                singleItem => singleItem.id === id
            );

            if (~index) {
                this.items.splice(index, 1);
            }
        },

        clear() {
            this.setItems([]);
        }
    }
});
