import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useFeedbackQuestionStore = defineStore('feedbackQuestion', {
    actions: {
        async index() {
            const { data } = await axios.get('/feedback-questions');

            return data;
        },

        async stats() {
            const { data } = await axios.get('/feedback-questions/stats');

            return data;
        }
    }
});
