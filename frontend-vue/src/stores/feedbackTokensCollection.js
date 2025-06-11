import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useFeedbackTokensCollectionStore = defineStore(
    'feedbackTokensCollection',
    {
        actions: {
            async index({ page = 1, perPage = 10, search = '' } = {}) {
                const params = { page, perPage, q: search };

                const { data } = await axios.get(
                    '/feedback-tokens-collections',
                    { params }
                );

                return data;
            },

            async store() {
                const { data } = await axios.post(
                    '/feedback-tokens-collections'
                );

                return data;
            }
        }
    }
);
