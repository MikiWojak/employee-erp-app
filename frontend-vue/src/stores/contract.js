import { defineStore } from 'pinia';

import axios from '@/services/api';

export const useContractStore = defineStore('contract', {
    state: () => ({
        items: []
    }),

    actions: {
        async index() {
            const {
                data: { rows: items }
            } = await axios.get('/contracts', {
                params: {
                    fetchAll: true
                }
            });

            this.setItems(items);
        },

        async store(data) {
            const { data: item } = await axios.post('/contracts', data);

            this.storeItem(item);
        },

        async update(data) {
            const { data: item } = await axios.put(
                `/contracts/${data.id}`,
                data
            );

            this.updateItem(item);
        },

        async destroy(id) {
            await axios.delete(`/contracts/${id}`);

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

        destroyItem(state, id) {
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
