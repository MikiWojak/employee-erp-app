<template>
    <v-container fluid>
        <h2>
            Days off left:
            <v-chip x-large :color="getColor(vacationDaysLeft)" dark>
                {{ vacationDaysLeft }}
            </v-chip>
        </h2>
    </v-container>
</template>

<script>
import { mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'DashboardPage',

    computed: {
        ...mapState(useAuthStore, ['vacationDaysLeft'])
    },

    methods: {
        getColor(value) {
            if (value > 0) {
                return 'green';
            }

            if (value === 0) {
                return 'orange';
            }

            return 'red';
        }
    }
};
</script>
