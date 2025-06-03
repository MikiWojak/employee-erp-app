import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useFeedbackAnswerStore = defineStore('feedbackAnswer', {
    actions: {
        async stats() {
            const { data } = await axios.get('/feedback-answers/stats');

            return data;
        },

        async store(form) {
            const { data } = await axios.post('/feedback-answers', form);

            return data;
        }
    }
});
