import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useSuggestionCommentStore = defineStore('suggestionComment', {
    actions: {
        async update(body) {
            const { data } = await axios.put(
                `/suggestion-comments/${body.id}`,
                body
            );

            return data;
        },

        async destroy(id) {
            await axios.delete(`/suggestion-comments/${id}`);
        }
    }
});
