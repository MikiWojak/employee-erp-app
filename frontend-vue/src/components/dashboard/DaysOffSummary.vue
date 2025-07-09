<template>
    <h2>Days off summary</h2>

    <v-row>
        <v-col
            v-for="(card, index) in cards"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
        >
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
        ...mapState(useAuthStore, ['loggedUser', 'vacationDaysLeft']),

        cards() {
            const commonProps = { variant: 'elevated' };

            return [
                {
                    title: this.loggedUser?.vacationDaysSum,
                    subtitle: 'Days off sum',
                    ...commonProps
                },
                {
                    title: 0, // @TODO
                    subtitle: 'Days off pending',
                    ...commonProps
                },
                {
                    title: this.loggedUser?.vacationDaysUsed,
                    subtitle: 'Days off used',
                    ...commonProps
                },
                {
                    title: this.vacationDaysLeft,
                    subtitle: 'Days off left',
                    ...commonProps,
                    color: this.daysOffLeftColor
                }
            ];
        },

        daysOffLeftColor() {
            if (this.vacationDaysLeft > 0) {
                return 'green';
            }

            if (this.vacationDaysLeft === 0) {
                return 'orange';
            }

            return 'red';
        }
    }
};
</script>
