<template>
    <h1> Questions </h1>

    <v-form @submit.prevent="doSubmitForm">
        <question-item
            v-for="question in items"
            :key="question.id"
            v-model="form[question.id]"
            :question="question"
        />

        <v-btn type="submit" :disabled="loading">
            <span>Submit</span>
        </v-btn>
    </v-form>
</template>

<script>
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';
import { StatusCodes as HTTP } from 'http-status-codes';

import { useFeedbackAnswerStore } from '@/stores/feedbackAnswer';
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
            total: 0,
            form: {}
        };
    },

    async created() {
        await this.doGetItems();
    },

    methods: {
        ...mapActions(useFeedbackAnswerStore, { submitForm: 'store' }),
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
        },

        async doSubmitForm() {
            try {
                this.loading = true;

                await this.submitForm(this.form);

                this.$toast.success('Form submitted successfully.');
            } catch (error) {
                const { response } = error;

                if (
                    response?.status === HTTP.BAD_REQUEST &&
                    response?.data?.errors
                ) {
                    const [errorItem] = response.data.errors;

                    this.$toast.error(errorItem.message || 'Invalid form.');

                    return;
                }

                this.$toast.error('Something went wrong.');

                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
