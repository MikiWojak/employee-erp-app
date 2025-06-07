import { defineStore } from 'pinia';

import axios from '@/services/axios';

export const useFeedbackQuestionStore = defineStore('feedbackQuestion', {
    actions: {
        async index() {
            const { data } = await axios.get('/feedback-questions');

            return data;
        },

        async stats({ role = null, departmentId = null } = {}) {
            const params = {
                ...(role && { role }),
                ...(departmentId && { departmentId })
            };

            const { data } = await axios.get('/feedback-questions/stats', {
                params
            });

            return data;
        }
    }
});
