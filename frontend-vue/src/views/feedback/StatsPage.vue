<template>
    <h1> Feedback - stats </h1>

    <div v-if="data">
        {{ data }}
    </div>
</template>

<script>
import { mapActions } from 'pinia';

import { useFeedbackAnswerStore } from '@/stores/feedbackAnswer';

export default {
    name: 'StatsPage',

    data() {
        return {
            data: null,
            loading: false
        };
    },

    async created() {
        await this.doGetStats();
    },

    methods: {
        ...mapActions(useFeedbackAnswerStore, ['stats']),

        async doGetStats() {
            try {
                this.loading = true;

                const data = await this.stats();

                this.data = data;
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
