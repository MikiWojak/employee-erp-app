<template>
    <h1> Questions </h1>

    <v-form @submit.prevent="doSubmitForm">
        <question-item
            v-for="question in items"
            :key="question.id"
            v-model="form[question.id]"
            :question="question"
        />

        <v-btn type="submit" width="100%" :disabled="loading">
            <span>Submit</span>
        </v-btn>
    </v-form>
</template>

<script>
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';

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

        // @TODO Consider BaseError as Parent
        async doSubmitForm() {
            // this.formErrorMessage = '';
            // this.serverErrors = [];

            // this.v$.formData.$touch();
            //
            // if (this.v$.formData.$invalid) {
            //     return;
            // }
            //
            // this.v$.formData.$reset();

            try {
                this.loading = true;

                await this.submitForm(this.form);

                this.$toast.success('Form submitted successfully');
            } catch (error) {
                // this.formData.password = '';
                //
                // const { response } = error;
                //
                // if (
                //     response?.status === HTTP.BAD_REQUEST &&
                //     response?.data?.errors
                // ) {
                //     this.formErrorMessage = 'Invalid credentials.';
                //     this.serverErrors = response.data.errors;
                //
                //     return;
                // }
                //
                // if (response?.status === HTTP.UNAUTHORIZED) {
                //     this.formErrorMessage = 'Mismatching credentials.';
                //
                //     return;
                // }

                console.error(error);

                // this.formErrorMessage = 'Something went wrong...';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
