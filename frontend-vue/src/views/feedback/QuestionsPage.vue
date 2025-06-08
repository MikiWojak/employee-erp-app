<template>
    <div v-if="isNoToken">
        <h1> No feedback form available </h1>
    </div>

    <div v-else-if="isFormFilled">
        <h1> Thank you for filling the feedback form </h1>
    </div>

    <div v-else>
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
    </div>
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
            loading: false,
            items: [],
            total: 0,
            form: {},
            formStatus: null
        };
    },

    computed: {
        isNoToken() {
            return this.formStatus === 'noToken';
        },

        isFormFilled() {
            return this.formStatus === 'success';
        }
    },

    async created() {
        try {
            await this.checkToken();

            await this.doGetItems();
        } catch (error) {
            if (error?.response?.status === HTTP.FORBIDDEN) {
                this.formStatus = 'noToken';
            }
        }
    },

    methods: {
        ...mapActions(useFeedbackAnswerStore, {
            submitForm: 'store',
            checkToken: 'checkToken'
        }),
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

                this.formStatus = 'success';

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

                if (response?.status === HTTP.FORBIDDEN) {
                    this.$toast.error('No feedback form available');

                    this.formStatus = 'noToken';

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
