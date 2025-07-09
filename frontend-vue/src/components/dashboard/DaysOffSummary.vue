<template>
    <h2>Days off summary</h2>

    <v-row>
        <v-col cols="12" md="6">
            <v-card
                :title="loggedUser?.vacationDaysSum"
                subtitle="Days off sum"
                variant="elevated"
            />
        </v-col>
    </v-row>

    <v-row>
        <v-col v-for="(card, index) in cards" :key="index" cols="12" md="6">
            <v-card v-bind="card" />
        </v-col>
    </v-row>
</template>

<script>
import { mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'DaysOffSummary',

    computed: {
        ...mapState(useAuthStore, [
            'loggedUser',
            'vacationSummary',
            'vacationDaysLeft'
        ]),

        cards() {
            const commonProps = { variant: 'elevated' };
            const { vacationDaysPending = 0 } = this.vacationSummary || {};
            const { vacationDaysUsed = 0 } = this.loggedUser || {};
            const vacationsDaysLeftExt =
                this.vacationDaysLeft - vacationDaysPending;

            return [
                {
                    title: vacationDaysPending,
                    subtitle: 'Days off pending',
                    ...commonProps
                },
                {
                    title: vacationDaysUsed,
                    subtitle: 'Days off used',
                    ...commonProps
                },
                {
                    title: vacationsDaysLeftExt,
                    subtitle: 'Days off left (including pending)',
                    ...commonProps,
                    color: this.getColor(vacationsDaysLeftExt)
                },
                {
                    title: this.vacationDaysLeft,
                    subtitle: 'Days off left',
                    ...commonProps,
                    color: this.getColor(this.vacationDaysLeft)
                }
            ];
        }
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
