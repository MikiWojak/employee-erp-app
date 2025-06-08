<template>
    <h1> Feedback - stats </h1>

    <v-row>
        <v-col cols="12" md="6">
            <tokens-collection-select
                v-model="selectedTokensCollection"
                clearable
            />
        </v-col>
    </v-row>

    <v-row v-if="isAdmin">
        <v-col cols="12" md="6">
            <role-select v-model="role" clearable />
        </v-col>

        <v-col cols="12" md="6">
            <department-select v-model="selectedDepartment" clearable />
        </v-col>
    </v-row>

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
import { defineAsyncComponent } from 'vue';
import { mapActions, mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useFeedbackQuestionStore } from '@/stores/feedbackQuestion';

export default {
    name: 'StatsPage',

    components: {
        Bar,
        RoleSelect: defineAsyncComponent(
            () => import('@/components/inputs/RoleSelect')
        ),
        DepartmentSelect: defineAsyncComponent(
            () => import('@/components/inputs/DepartmentSelect')
        ),
        TokensCollectionSelect: defineAsyncComponent(
            () => import('@/components/inputs/FeedbackTokensCollectionSelect')
        )
    },

    data() {
        return {
            questions: [],
            loading: false,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            },
            role: null,
            selectedDepartment: null,
            selectedTokensCollection: null
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        processedQuestions() {
            return this.questions.map(item => {
                return {
                    ...item,
                    data: {
                        labels: item.answerOptions,
                        datasets: [
                            {
                                backgroundColor: '#03A9F4',
                                data: item.data
                            }
                        ]
                    }
                };
            });
        }
    },

    watch: {
        async role() {
            await this.doGetStats();
        },

        selectedDepartment: {
            async handler() {
                await this.doGetStats();
            },
            deep: true
        },

        selectedTokensCollection: {
            async handler() {
                await this.doGetStats();
            },
            deep: true
        }
    },

    async created() {
        await this.doGetStats();
    },

    methods: {
        ...mapActions(useFeedbackQuestionStore, ['stats']),

        async doGetStats() {
            try {
                this.loading = true;

                const questions = await this.stats({
                    ...(this.role && { role: this.role }),
                    ...(this.selectedDepartment && {
                        departmentId: this.selectedDepartment.id
                    }),
                    ...(this.selectedTokensCollection && {
                        feedbackTokensCollectionId:
                            this.selectedTokensCollection.id
                    })
                });

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
