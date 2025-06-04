<template>
    <h1> Feedback - stats </h1>

    <v-row>
        <v-col
            v-for="question in processedQuestions"
            :key="question.id"
            cols="12"
            md="6"
            xl="4"
        >
            <h2> {{ question.title }} </h2>

            <Bar :data="question.data" :options="options" />
        </v-col>
    </v-row>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { mapActions } from 'pinia';

import { useFeedbackAnswerStore } from '@/stores/feedbackAnswer';

export default {
    name: 'StatsPage',

    components: {
        Bar
    },

    data() {
        return {
            questions: [],
            loading: false,
            options: {
                responsive: true
            }
        };
    },

    computed: {
        processedQuestions() {
            return this.questions.map(item => {
                return {
                    ...item,
                    data: {
                        labels: item.answerOptions,
                        datasets: [
                            {
                                label: item.title,
                                backgroundColor: '#03A9F4',
                                data: item.data
                            }
                        ]
                    }
                };
            });
        }
    },

    async created() {
        await this.doGetStats();
    },

    methods: {
        ...mapActions(useFeedbackAnswerStore, ['stats']),

        async doGetStats() {
            try {
                this.loading = true;

                const questions = await this.stats();

                this.questions = questions;
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
