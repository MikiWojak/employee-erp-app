<template>
    <h1> Questions </h1>

    <question-item
        v-for="question in items"
        :key="question.id"
        :question="question"
    />
</template>

<script>
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { useFeedbackQuestionStore } from '@/stores/feedbackQuestion';

export default {
    name: 'QuestionsPage',

    components: {
        QuestionItem: defineAsyncComponent(
            () => import('@/components/feedback/QuestionItem')
        )
    },

    data() {
        return {
            isLoading: false,
            items: [],
            total: 0
        };
    },

    async created() {
        await this.doGetItems();
    },

    methods: {
        ...mapActions(useFeedbackQuestionStore, { getItems: 'index' }),

        async doGetItems() {
            try {
                this.loading = true;

                const { rows, count } = await this.getItems();

                this.items = rows;
                this.total = count;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot fetch data');
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
